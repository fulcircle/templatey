import React, {ChangeEvent, Component} from 'react';
import './App.scss';
import {Api} from "./api/Api.class";
import {TemplateRenderResponse} from "./data/response/TemplateRenderResponse.interface";
import DOMPurify from 'dompurify'
import TemplateFieldsPane from "./components/TemplateFieldsPane/TemplateFieldsPane";
import {ToRender} from "./data/request/ToRender.class";
import TemplateTextPane from "./components/TemplateTextPane/TemplateTextPane";
import {EmailFields} from "./data/request/EmailFields.class";
import EmailPane from "./components/EmailPane/EmailPane";
import {ValidationError, validateSync} from "class-validator";
import {TemplateFields} from "./data/request/TemplateFields.class";

class Validation {

    pristine: boolean = true;
    validationErrors: ValidationError[] = [];

    constructor(validation: Validation) {
        Object.assign(this, validation);
    }
}

interface State {
    validation: Validation,
    rendered: TemplateRenderResponse,
    toRender: ToRender
    emailFields: EmailFields
}

export const ValidationContext = React.createContext<Validation>({validationErrors: [], pristine: true});

class App extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            toRender: new ToRender({ template_fields: [], template_text: '' }),
            emailFields: new EmailFields({from: "", to: ""}),
            validation: new Validation({validationErrors: [], pristine: true}),
            rendered: new TemplateRenderResponse({ template: "", template_name: "" })
        }
    }

    componentDidMount(): void {
        this.renderTemplate();
    }

    addTemplateField() {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_fields.push(new TemplateFields({name: "", value: ""}));
        this.setState({toRender: toRender});
    }

    removeTemplateField(idx: number) {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_fields.splice(idx, 1);
        this.setState({toRender: toRender});
    }

    onTemplateFieldChange(event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, idx: number, property: string) {
        let toRender = new ToRender(this.state.toRender);

        if (property === 'value')  {
            toRender.template_fields[idx].value = event.target.value;
        } else if (property === 'name') {
            toRender.template_fields[idx].name = event.target.value;
        }

        this.setState({toRender: toRender}, () => this.validate());
    }

    onTemplateTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_text = event.target.value;
        this.setState({toRender: toRender}, () => this.validate())
    }


    async renderTemplate() {
        let valid = this.validate(false);
        if (valid) {
            let rendered = await Api.render(this.state.toRender);
            this.setState({rendered: rendered})
        }
    }

    onEmailFieldsChange(event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, emailFields: EmailFields, property: string) {
        let updatedEmailFields = new EmailFields(emailFields);
        if (property === 'from') {
            updatedEmailFields.from = event.target.value;
        } else if (property === 'to') {
            updatedEmailFields.to = event.target.value;
        }

        this.setState({emailFields: updatedEmailFields}, () => this.validate() )
    }

    async sendEmail() {
        let valid = this.validate(false);
        if (valid) {
            await Api.send_email(this.state.toRender, this.state.emailFields);
        }
    }

    validate(pristine: boolean|null=null) {

        // Validate on the backing state fields.
        let errors = [
            ...validateSync(this.state.emailFields),
            ...validateSync(this.state.toRender),
        ];

        // When setState completes, it will cause ValidationContext.Provider to update its context
        // and trigger all ValidatableInputs to check if they have any errors
        this.setState({
            validation:
                {
                    validationErrors: errors,
                    pristine: pristine === null ? this.state.validation.pristine : pristine
                }
        });

        return errors.length === 0;
    }

    render() {
        return (
            <div className="App">
                <ValidationContext.Provider value={this.state.validation}>
                    <div className="editor_pane">
                        <TemplateFieldsPane
                            template_fields={this.state.toRender.template_fields}
                            addField={() => this.addTemplateField()}
                            removeField={(idx: number) => this.removeTemplateField(idx)}
                            changeField={(event, idx: number, property: string) => this.onTemplateFieldChange(event, idx, property)}
                        />

                        <TemplateTextPane
                            toRender={this.state.toRender}
                            changeText={(event: ChangeEvent<HTMLTextAreaElement>) => this.onTemplateTextChange(event)}
                        />
                    </div>

                    <EmailPane
                        emailFields={this.state.emailFields}
                        sendEmail={ () => this.sendEmail() }
                        updateEmailFields={ (event: ChangeEvent<HTMLInputElement>,
                                             emailFields: EmailFields,
                                             property: string) => this.onEmailFieldsChange(event, emailFields, property)}
                    />

                    <div className="render_button" onClick={ () => this.renderTemplate() }>
                        RENDER
                    </div>

                </ValidationContext.Provider>

                <div className="preview_pane" dangerouslySetInnerHTML={ {__html: DOMPurify.sanitize(this.state.rendered.template)} } />

            </div>
        );
    }
}

export default App;
