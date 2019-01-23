import React, {ChangeEvent, Component} from 'react';
import {EmailFields} from "../../data/request/EmailFields.class";
import {ValidationContext} from "../../App";
import ValidatableInput from "../ValidatableInput/ValidatableInput";
import {Button, Grid, Paper} from "@material-ui/core";

interface Props {
    emailFields: EmailFields,
    sendEmail: Function,
    updateEmailFields: Function
}

class EmailPane extends Component<Props, {}> {


    constructor(props: Props) {
        super(props);
    }

    render() {

        return (
            <ValidationContext.Consumer>
                {({ validationErrors, pristine })  => (
                    <Grid container direction="column">
                        <Grid container direction="row" wrap="nowrap" style={{marginBottom: 15}}>
                            <ValidatableInput
                                value={this.props.emailFields.from}
                                label="From"

                                validationErrors={validationErrors}
                                pristine={pristine}
                                validationTarget={this.props.emailFields}
                                validationProperty={'from'}

                                onChange={ (event: ChangeEvent) => this.props.updateEmailFields(event, this.props.emailFields, 'from') }/>
                            <ValidatableInput
                                value={this.props.emailFields.to}
                                label={"To"}

                                validationErrors={validationErrors}
                                pristine={pristine}
                                validationTarget={this.props.emailFields}
                                validationProperty={'to'}

                                onChange={ (event: ChangeEvent) => this.props.updateEmailFields(event, this.props.emailFields, 'to') }/>
                        </Grid>
                        <Button variant="contained" color="primary" className="render_button" onClick={ () => this.props.sendEmail() }>
                            Send
                        </Button>
                    </Grid>
                )

                }

            </ValidationContext.Consumer>
        )
    }
}

export default EmailPane;
