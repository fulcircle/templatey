import React, {ChangeEvent, Component} from 'react';
import './App.scss';
import {Api} from "./api/Api.class";
import {TemplateRenderResponse} from "./data/response/TemplateRenderResponse.interface";
import DOMPurify from 'dompurify'
import FieldPane from "./components/FieldPane/FieldPane";
import {ToRender} from "./data/request/ToRender.class";
import TextPane from "./components/TextPane/TextPane";
import {EmailFields} from "./data/request/EmailFields.class";
import EmailPane from "./components/EmailPane/EmailPane";
import {ValidationError, validateSync} from "class-validator";
import {TemplateFields} from "./data/request/TemplateFields.class";

interface State {
    validationErrors: ValidationError[],
    rendered: TemplateRenderResponse,
    toRender: ToRender
    emailFields: EmailFields
}

interface ValidationContextInterface {
    validationErrors: ValidationError[]
}

export const ValidationContext = React.createContext<ValidationContextInterface>({validationErrors: []});

class App extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            validationErrors: [],
            rendered: { template: "", template_name: "" },
            toRender: new ToRender({ template_fields: [], template_text: '' }),
            emailFields: new EmailFields({from: "", to: ""})
        }
    }

    addField() {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_fields.push(new TemplateFields({name: "", value: ""}));
        this.setState({toRender: toRender}, () => this.validate());
    }

    removeField(idx: number) {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_fields.splice(idx, 1);
        this.setState({toRender: toRender}, () => this.validate());
    }

    onTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_text = event.target.value;
        this.setState({toRender: toRender}, () => this.validate())
    }

    onFieldChange(event: ChangeEvent<HTMLInputElement>, idx: number, property: string) {
        let toRender = new ToRender(this.state.toRender);

        if (property === 'value')  {
            toRender.template_fields[idx].value = event.target.value;
        } else if (property === 'name') {
            toRender.template_fields[idx].name = event.target.value;
        }

        this.setState({toRender: toRender}, () => this.validate());
    }

    componentDidMount(): void {
        this.renderTemplate();
    }

    async renderTemplate() {
        let valid = await this.validate();
        if (valid) {
            let rendered = await Api.render(this.state.toRender);
            this.setState({rendered: rendered})
        } else {
            // Show errors
        }
    }

    updateEmailFields(event: ChangeEvent<HTMLInputElement>, emailFields: EmailFields, property: string) {
        let updatedEmailFields = new EmailFields(emailFields);
        if (property === 'from') {
            updatedEmailFields.from = event.target.value;
        } else if (property === 'to') {
            updatedEmailFields.to = event.target.value;
        }

        this.setState({emailFields: updatedEmailFields}, () => this.validate() )
    }

    async sendEmail() {
        let valid = this.validate();
        if (valid) {
            await Api.send_email(this.state.toRender, this.state.emailFields);
        } else {
            // Show errors
        }
    }

    validate() {
        let errors = [
            ...validateSync(this.state.emailFields),
            ...validateSync(this.state.toRender),
        ];

        this.setState({validationErrors: errors});

        return errors.length === 0;
    }

    render() {
        return (
            <div className="App">
                <ValidationContext.Provider value={{validationErrors: this.state.validationErrors}}>
                    <div className="editor_pane">
                        <FieldPane
                            template_fields={this.state.toRender.template_fields}
                            addField={() => this.addField()}
                            removeField={(idx: number) => this.removeField(idx)}
                            changeField={(event: ChangeEvent<HTMLInputElement>, idx: number, property: string) => this.onFieldChange(event, idx, property)}
                        />

                        <TextPane
                            template_text={this.state.toRender.template_text}
                            changeText={(event: ChangeEvent<HTMLTextAreaElement>) => this.onTextChange(event)}
                        />
                    </div>

                    <EmailPane
                        emailFields={this.state.emailFields}
                        sendEmail={ () => this.sendEmail() }
                        updateEmailFields={ (event: ChangeEvent<HTMLInputElement>,
                                             emailFields: EmailFields,
                                             property: string) => this.updateEmailFields(event, emailFields, property)}
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
