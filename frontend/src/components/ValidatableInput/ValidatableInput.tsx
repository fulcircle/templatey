import React, {ChangeEvent, Component} from 'react';
import {ValidationContext} from "../../App";
import {ValidationError} from "class-validator";

interface Props {
    validationTarget: any,
    validationProperty: string,
    textArea: boolean,
    value: string,
    validationErrors: ValidationError[],
    onChange: (event: ChangeEvent) => any
}

class ValidatableInput extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
        this.state = {
            validationError: null
        }
    }

    getValidationErrors() {
        let errors = this.props.validationErrors.filter((validationError) => {
            return validationError.target === this.props.validationTarget
                && validationError.property === this.props.validationProperty;
        });
        if (errors.length > 0) {
            return errors[0];
        } else {
            return null;
        }
    }

    // get valid() {
    //     return this.state.validationError === null;
    // }

    render() {

        let errors = this.getValidationErrors();
        let valid = errors === null;

        if (!valid) {
            console.log(errors)
        }


        if (!this.props.textArea) {
            return <input className={valid ? '' : 'error'} value={this.props.value} onChange={(event: ChangeEvent<HTMLInputElement>) => this.props.onChange(event)}/>
        } else {
            return <textarea className={valid ? '' : 'error' } value={this.props.value} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => this.props.onChange(event)}/>

        }

    }
}

export default ValidatableInput;
