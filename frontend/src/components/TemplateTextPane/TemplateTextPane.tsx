import React, {Component} from 'react';
import ValidatableInput from "../ValidatableInput/ValidatableInput";
import {ValidationContext} from "../../App";
import {ToRender} from "../../data/request/ToRender.class";
import {Grid, Paper} from "@material-ui/core";

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
                    <Grid container style={{marginBottom: 20}}>
                        <Paper style={{width: "100%"}}>
                            <ValidatableInput
                                value={this.props.toRender.template_text}
                                label="Template Text"
                                style={{width: "100%", border: "none"}}
                                rows={10}
                                variant={"outlined"}

                                validationErrors={validationErrors}
                                pristine={pristine}
                                validationTarget={this.props.toRender}
                                validationProperty={'template_text'}

                                multiline={true}

                                onChange={(event) => this.props.changeText(event)} />
                        </Paper>
                    </Grid>
                        )}
            </ValidationContext.Consumer>
        );
    }
}

export default TemplateTextPane;
