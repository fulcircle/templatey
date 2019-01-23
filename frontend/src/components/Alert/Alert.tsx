import React, {Component} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";

interface Props {
    alertTitle: string
    alertMessage: string
    open: boolean,
    handleClose: Function
}

class Alert extends Component<Props> {


    constructor(props: Props) {
        super(props);
    }

    render() {
        return (<Dialog
            open={this.props.open}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {this.props.alertMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.props.handleClose()} color="primary" autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>)

    }
}

export default Alert;
