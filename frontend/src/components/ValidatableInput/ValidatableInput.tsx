import React, {ChangeEvent, Component} from 'react';
import {ValidationError} from "class-validator";
import {Util} from "../../util/Util";
import {Grid, TextField} from "@material-ui/core";

interface Props {
    validationTarget: any,
    validationProperty: string,
    value: string,
    validationErrors: ValidationError[],
    pristine: boolean,
    onChange: (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => any,
    multiline?: boolean,
    label?: string,
    variant?: any,
    style?: any;
    rows?: any
}

class ValidatableInput extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    get localValidationErrors() {
        return this.props.validationErrors.filter((validationError) => {
            return validationError.target === this.props.validationTarget
                && validationError.property === this.props.validationProperty;
        });
    }

    get valid(): boolean {
        // console.log({
        //     validationTarget: this.props.validationTarget,
        //     validationProperty: this.props.validationProperty,
        //     validationErrors: this.props.validationErrors,
        //     valid: this.localValidationErrors.length === 0,
        //     localValidationErrors: this.localValidationErrors,
        //     pristine: this.props.pristine
        // });
        return this.localValidationErrors.length === 0 || this.props.pristine;
    }

    get errorClass() {
        return this.valid ? '' : 'error'
    }

    render() {

        let error_msg = "";

        if (!this.valid) {
            error_msg = Util.extractErrorMessages(this.localValidationErrors[0])[0];
        }

        let errorContainer: any;
        if (this.props.multiline) {
            errorContainer =
                <Grid container justify={"flex-start"}
                      style={{
                          position: 'absolute',
                          bottom: 10,
                          left: 10,
                          fontSize: 12,
                          color: "red",
                          height: 14}}>
                    {error_msg}
                </Grid>

        } else {
            errorContainer =
                <Grid container justify={"flex-start"}
                  style={{
                      fontSize: 12,
                      marginTop: 10,
                      color: "red",
                      height: 14}}>
                {error_msg}
            </Grid>
        }

        return (
            <Grid direction={"column"} style={{position: "relative"}}>
                <TextField className={this.errorClass}
                           value={this.props.value}
                           multiline={this.props.multiline}
                           variant={this.props.variant}
                           label={this.props.label}
                           style={this.props.style}
                           rows={this.props.rows}
                           onChange={(event: ChangeEvent<HTMLTextAreaElement>) => this.props.onChange(event)}/>
                {errorContainer}
            </Grid>
        )


    }
}

export default ValidatableInput;
