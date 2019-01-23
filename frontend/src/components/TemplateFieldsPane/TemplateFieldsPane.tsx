import React, {ChangeEvent, Component} from 'react';
import {TemplateFields} from "../../data/request/TemplateFields.class";
import {ValidationContext} from "../../App";
import ValidatableInput from "../ValidatableInput/ValidatableInput";
import {Button, Grid, Paper} from "@material-ui/core";

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
                        <Grid container justify={"center"} direction="row" wrap="nowrap" style={{padding: 25, marginBottom: 20}}>
                            <ValidatableInput
                                value={field.name}
                                label="Field Name"

                                validationErrors={validationErrors}
                                pristine={pristine}
                                validationTarget={field}
                                validationProperty={'name'}

                                onChange={(event) => this.props.changeField(event, idx, 'name')}/>

                            <ValidatableInput
                                value={field.value}
                                label="Field Value"

                                validationErrors={validationErrors}
                                pristine={pristine}
                                validationTarget={field}
                                validationProperty={'value'}

                                onChange={(event) => this.props.changeField(event, idx, 'value')}/>

                            <Button variant="contained" color="secondary" className="RemoveFieldButton" onClick={event => this.props.removeField(idx)}>
                                Remove Field
                            </Button>
                        </Grid>)}
                </ValidationContext.Consumer>)
        });

        return (
            <Grid container direction={"column"}>
                <Paper style={{width: "100%", marginBottom: 20}}>
                    {fields}
                </Paper>
                <Button style={{width: "100%", height: 50}} variant="contained" color="primary" className="AddFieldButton" onClick={event => this.props.addField()}>
                    Add New Field
                </Button>
            </Grid>
        );
    }
}

export default TemplateFieldsPane;
