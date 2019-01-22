import React, {Component} from 'react';
import {TemplateField} from "../../data/TemplateField.interface";

interface Props {
    fields: Array<TemplateField>
}

class FieldPane extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {

        let fields = this.props.fields.map((field) => {
            return <div className="field">
                {field.name}: {field.value}
            </div>
        });

        return (
            <div className="field_pane">
                {fields}
            </div>
        );
    }
}

export default FieldPane;
