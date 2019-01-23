import React, {ChangeEvent, Component} from 'react';
import './App.scss';
import {Api, ResponseError} from "./api/Api.class";
import {TemplateRenderResponse} from "./data/response/TemplateRenderResponse.interface";
import DOMPurify from 'dompurify'
import TemplateFieldsPane from "./components/TemplateFieldsPane/TemplateFieldsPane";
import {ToRender} from "./data/request/ToRender.class";
import TemplateTextPane from "./components/TemplateTextPane/TemplateTextPane";
import {EmailFields} from "./data/request/EmailFields.class";
import EmailPane from "./components/EmailPane/EmailPane";
import {ValidationError, validateSync} from "class-validator";
import {TemplateFields} from "./data/request/TemplateFields.class";
import {Util} from "./util/Util";

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

// Create a Validation context that's accessible to all children components so they can validate themselves
export const ValidationContext = React.createContext<Validation>(new Validation({validationErrors: [], pristine: true}));

class App extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            toRender: new ToRender({ template_fields: [new TemplateFields({name: "", value: ""})], template_text: '' }),
            emailFields: new EmailFields({from: "", to: ""}),
            validation: new Validation({validationErrors: [], pristine: true}),
            rendered: new TemplateRenderResponse({ template: "", template_name: "" })
        }
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

        this.setState({toRender: toRender}, () => this.validate(['render']));
    }

    onTemplateTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_text = event.target.value;
        this.setState({toRender: toRender}, () => this.validate(['render']))
    }


    async renderTemplate() {

        let valid = this.validate(['render']);
        if (valid) {

            try {

                let rendered = await Api.render(this.state.toRender);
                this.setState({rendered: rendered});

            } catch (e) {

                let alert_text = "Sorry! There was an error generating the template.  Our developers have been notified.";
                if (e instanceof ResponseError) {
                    alert_text += "Status code: " + e.response.status;
                }

                alert(alert_text)
            }
        }

        let validation = new Validation(this.state.validation);
        validation.pristine = false;
        this.setState({validation: validation})
    }

    onEmailFieldsChange(event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, emailFields: EmailFields, property: string) {
        let updatedEmailFields = new EmailFields(emailFields);
        if (property === 'from') {
            updatedEmailFields.from = event.target.value;
        } else if (property === 'to') {
            updatedEmailFields.to = event.target.value;
        }

        this.setState({emailFields: updatedEmailFields}, () => this.validate(['email']) )
    }

    async sendEmail() {

        let valid = this.validate(['email']);
        if (valid) {
            try {
                // First render to check for any errors
                await this.renderTemplate();
                await Api.send_email(this.state.toRender, this.state.emailFields);

                alert("Email sent successfully!");


            } catch (e) {

                let alert_text = "Sorry! There was an error sending the e-mail.  Our engineers have been notified.";
                if (e instanceof ResponseError) {
                    alert_text += "Status code: " + e.response.status;
                }

                alert(alert_text)
            }
        }

        let validation = new Validation(this.state.validation);
        validation.pristine = false;
        this.setState({validation: validation})
    }

    validate(groups: Array<string>=[]) {

        // Validate on the backing state fields, flatten them into one long array., instead of nested errors
        let errors = [
            ...Util.flattenErrors(validateSync(this.state.emailFields, {groups: groups})),
            ...Util.flattenErrors(validateSync(this.state.toRender, {groups: groups}))
        ];

        let validation = new Validation(this.state.validation);
        validation.validationErrors = errors;

        // When setState completes, it will cause ValidationContext.Provider to update its context
        // and trigger all ValidatableInputs to check if they have any errors
        this.setState({ validation: validation });

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
