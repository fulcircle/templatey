import React, {ChangeEvent, Component} from 'react';
import {TemplateFields} from "../../data/request/TemplateFields.class";
import {ValidationContext} from "../../App";
import ValidatableInput from "../ValidatableInput/ValidatableInput";

interface Props {
    template_fields: Array<TemplateFields>,
    addField: () => void,
    removeField: (idx: number) => void,
    changeField: (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, idx: number, property: string) => void
}

class TemplateFieldsPane extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {

        let fields = this.props.template_fields.map((field, idx) => {
            return (
                <ValidationContext.Consumer key={idx}>
                    {({ validationErrors, pristine })  => (
                        <div className="field">
                            <ValidatableInput
                                textArea={false}
                                className="field_input_name"
                                value={field.name}

                                validationErrors={validationErrors}
                                pristine={pristine}
                                validationTarget={field}
                                validationProperty={'name'}

                                onChange={(event) => this.props.changeField(event, idx, 'name')}/>

                            <ValidatableInput
                                textArea={false}
                                className="field_input_value"
                                value={field.value}

                                validationErrors={validationErrors}
                                pristine={pristine}
                                validationTarget={field}
                                validationProperty={'value'}

                                onChange={(event) => this.props.changeField(event, idx, 'value')}/>

                            <div className="remove_field_button" onClick={event => this.props.removeField(idx)}>
                                REMOVE
                            </div>
                        </div>)}
                </ValidationContext.Consumer>)
        });

        return (
            <div className="field_pane">

                <div className="fields">
                    {fields}
                </div>
                <div className="add_field_button" onClick={event => this.props.addField()}>
                    ADD
                </div>

            </div>
        );
    }
}

export default TemplateFieldsPane;
