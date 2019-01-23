import React, {Component} from 'react';
import ValidatableInput from "../ValidatableInput/ValidatableInput";
import {ValidationContext} from "../../App";
import {ToRender} from "../../data/request/ToRender.class";

interface Props {
    toRender: ToRender,
    changeText: Function,
}

class TemplateTextPane extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {

        return (
            <ValidationContext.Consumer>
                {({ validationErrors, pristine })  => (
                    <div className="text">
                        <ValidatableInput
                            className=""
                            textArea={true}
                            value={this.props.toRender.template_text}

                            validationErrors={validationErrors}
                            pristine={pristine}
                            validationTarget={this.props.toRender}
                            validationProperty={'template_text'}

                            onChange={(event) => this.props.changeText(event)} />
                    </div>)}
            </ValidationContext.Consumer>
        );
    }
}

export default TemplateTextPane;
