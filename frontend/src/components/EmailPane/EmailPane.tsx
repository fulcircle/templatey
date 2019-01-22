import React, {ChangeEvent, Component} from 'react';
import {EmailFields} from "../../data/request/EmailFields.class";
import {ValidationContext} from "../../App";
import ValidatableInput from "../ValidatableInput/ValidatableInput";

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
                {({ validationErrors })  => (
                    <div className="email">
                        <div className="from_email">
                            <ValidatableInput
                                validationErrors={validationErrors}
                                value={this.props.emailFields.from}
                                textArea={false}
                                validationTarget={this.props.emailFields}
                                validationProperty={'from'}
                                onChange={ (event: ChangeEvent) => this.props.updateEmailFields(event, this.props.emailFields, 'from') }/>
                        </div>
                        <div className="to_email">
                            <ValidatableInput
                                validationErrors={validationErrors}
                                value={this.props.emailFields.to}
                                textArea={false}
                                validationTarget={this.props.emailFields}
                                validationProperty={'to'}
                                onChange={ (event: ChangeEvent) => this.props.updateEmailFields(event, this.props.emailFields, 'to') }/>
                        </div>
                        <div className="render_button" onClick={ () => this.props.sendEmail() }>
                            SEND
                        </div>
                    </div>)}
            </ValidationContext.Consumer>
        )
    }
}

export default EmailPane;
