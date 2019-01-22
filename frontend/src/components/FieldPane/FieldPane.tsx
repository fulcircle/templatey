import React, {ChangeEvent, Component} from 'react';
import {TemplateFields} from "../../data/request/TemplateFields.class";

interface Props {
    template_fields: Array<TemplateFields>,
    addField: () => void,
    removeField: (idx: number) => void,
    changeField: (event: ChangeEvent<HTMLInputElement>, idx: number, property: string) => void
}

class FieldPane extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {

        let fields = this.props.template_fields.map((field, idx) => {
            return <div key={idx} className="field">
                <input className="field_input_name" value={field.name} onChange={(event) => this.props.changeField(event, idx, 'name')}/>
                <input className="field_input_value" value={field.value} onChange={(event) => this.props.changeField(event, idx, 'value')}/>
                <div className="remove_field_button" onClick={event => this.props.removeField(idx)}>
                    REMOVE
                </div>
            </div>
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

export default FieldPane;
