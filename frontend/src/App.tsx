import React, {ChangeEvent, Component} from 'react';
import {Api, ResponseError} from "./api/Api.class";
import {TemplateError, TemplateRenderResponse} from "./data/response/TemplateRenderResponse.interface";
import DOMPurify from 'dompurify'
import TemplateFieldsPane from "./components/TemplateFieldsPane/TemplateFieldsPane";
import {ToRender} from "./data/request/ToRender.class";
import TemplateTextPane from "./components/TemplateTextPane/TemplateTextPane";
import {EmailFields} from "./data/request/EmailFields.class";
import {ValidationError, validateSync} from "class-validator";
import {TemplateFields} from "./data/request/TemplateFields.class";
import {Util} from "./util/Util";

// Material-UI
import 'typeface-roboto'
import {Button, Grid} from '@material-ui/core/'
import Alert from "./components/Alert/Alert";
import EmailDialog from "./components/EmailDialog/EmailDialog";

class Validation {

    pristine: boolean = true;
    validationErrors: ValidationError[] = [];

    constructor(validation: Validation) {
        Object.assign(this, validation);
    }
}

interface State {
    emailDialogOpen: boolean,
    alertOpen: boolean,
    alertMessage: string,
    validation: Validation,
    rendered: TemplateRenderResponse,
    toRender: ToRender,
    emailFields: EmailFields,
}

// Create a Validation context that's accessible to all children components so they can validate themselves
export const ValidationContext = React.createContext<Validation>(new Validation({validationErrors: [], pristine: true}));

class App extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            emailDialogOpen: false,
            alertOpen: false,
            alertMessage: "",
            toRender: new ToRender({ template_fields: [new TemplateFields({name: "", value: ""})], template_text: '' }),
            emailFields: new EmailFields({from: "", to: ""}),
            validation: new Validation({validationErrors: [], pristine: true}),
            rendered: new TemplateRenderResponse({
                template: "",
                template_name: "",
                template_error: new TemplateError({error_msg: '', has_error: false}) })
        }
    }

    componentDidMount(): void {
        this.validate();
    }

    addTemplateField() {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_fields.push(new TemplateFields({name: "", value: ""}));
        this.setState({toRender: toRender});
    }

    removeTemplateField(idx: number) {
        let toRender = new ToRender(this.state.toRender);
        toRender.template_fields.splice(idx, 1);
        this.setState({toRender: toRender}, () => this.validate(['render']));
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

        let validation = new Validation(this.state.validation);
        validation.pristine = false;
        this.setState({validation: validation}, async () => {
            let valid = this.validate(['render']);
            if (valid) {

                try {

                    let rendered = await Api.render(this.state.toRender);

                    if (rendered.template_error.has_error) {
                        this.openAlert("There was an error when rendering your template: " + rendered.template_error.error_msg + " Please check your template text is properly formulated.")
                    } else {
                        this.setState({rendered: rendered});
                    }

                } catch (e) {

                    let alert_text = "Sorry! There was an error generating the template.  Our developers have been notified.";
                    if (e instanceof ResponseError) {
                        alert_text += "Status code: " + e.response.status;
                    }

                    this.openAlert(alert_text)
                }
            }
        })

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

        let validation = new Validation(this.state.validation);
        validation.pristine = false;

        this.setState({validation: validation}, async () => {
            let valid = this.validate(['email']);
            if (valid) {
                try {
                    // First render to check for any errors
                    await this.renderTemplate();
                    await Api.send_email(this.state.toRender, this.state.emailFields);

                    this.openAlert("EmailDialog sent successfully!");
                    this.closeEmailDialog();


                } catch (e) {

                    let alert_text = "Sorry! There was an error sending the e-mail.  Our engineers have been notified.";
                    if (e instanceof ResponseError) {
                        alert_text += "Status code: " + e.response.status;
                    }

                    this.openAlert(alert_text)
                }
            }})
    }

    openAlert(alertMsg: string) {
        this.setState({alertOpen: true, alertMessage: alertMsg})
    }

    closeAlert() {
        this.setState({alertOpen: false})
    }

    openEmailDialog() {
        this.setState({emailDialogOpen: true})
    }

    closeEmailDialog() {
        this.setState({emailDialogOpen: false})
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

    get shouldDisableEmailButton() {
        let emailErrors =
            this.state.validation.validationErrors.filter((validationError) => {
            return validationError.target !== this.state.emailFields
        });

        return emailErrors.length !== 0;
    }

    render() {
        return (
            <Grid container direction="row" wrap={"nowrap"} spacing={8} style={{padding: 25}}>
                <ValidationContext.Provider value={this.state.validation}>
                    <Grid container direction="column" style={{width: "50%", maxWidth: 800}}>

                        <TemplateTextPane
                            toRender={this.state.toRender}
                            changeText={(event: ChangeEvent<HTMLTextAreaElement>) => this.onTemplateTextChange(event)}
                        />
                        <Grid container direction={"row"} wrap={"nowrap"} style={{marginBottom: 50}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={ () => this.renderTemplate() }
                            style={{width: "50%", marginBottom: 20, marginRight: 20}}
                        >
                            Render
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={this.shouldDisableEmailButton}
                            onClick={ () => this.openEmailDialog() }
                            style={{width: "50%", marginBottom: 20}}>
                            Send Test E-mail
                        </Button>
                        </Grid>

                        <TemplateFieldsPane
                            template_fields={this.state.toRender.template_fields}
                            addField={() => this.addTemplateField()}
                            removeField={(idx: number) => this.removeTemplateField(idx)}
                            changeField={(event, idx: number, property: string) => this.onTemplateFieldChange(event, idx, property)}
                        />
                    </Grid>

                    <EmailDialog open={this.state.emailDialogOpen}
                                 emailFields={this.state.emailFields}
                                 sendEmail={() => this.sendEmail()}
                                 onEmailFieldsChange={(event: ChangeEvent<HTMLInputElement>,
                                                       emailFields: EmailFields,
                                                       property: string) => this.onEmailFieldsChange(event, emailFields, property)}
                                 handleEmailDialogClose={() => this.closeEmailDialog()}/>


                </ValidationContext.Provider>

                <Grid container direction="column" alignItems={"center"} justify={"flex-start"} style={{width: "50%"}}>
                    <div className="PreviewContent" dangerouslySetInnerHTML={ {__html: DOMPurify.sanitize(this.state.rendered.template)} } />
                </Grid>

                <Alert
                    alertMessage={this.state.alertMessage}
                    alertTitle={"Error"}
                    handleClose={() => this.closeAlert()}
                    open={this.state.alertOpen}/>
            </Grid>



        );
    }
}

export default App;
