import React, {ChangeEvent, Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EmailPane from "../EmailPane/EmailPane";
import {EmailFields} from "../../data/request/EmailFields.class";

interface Props {
    open: boolean,
    emailFields: EmailFields,
    sendEmail: Function,
    onEmailFieldsChange: Function
    handleEmailDialogClose: Function,
}

class EmailDialog extends Component<Props> {

    render() {
        return (
            <div>
                <Dialog open={this.props.open} onClose={() => this.props.handleEmailDialogClose()}>
                    <DialogTitle>Send Test E-mail</DialogTitle>
                    <DialogContent>
                        <EmailPane emailFields={this.props.emailFields}
                                   sendEmail={() => this.props.sendEmail()}
                                   updateEmailFields={
                                       (event: ChangeEvent<HTMLInputElement>,
                                         emailFields: EmailFields,
                                         property: string) => this.props.onEmailFieldsChange(event, emailFields, property)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.handleEmailDialogClose(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default EmailDialog;