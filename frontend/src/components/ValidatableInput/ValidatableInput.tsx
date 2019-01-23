import React, {ChangeEvent, Component} from 'react';
import {ValidationError} from "class-validator";

interface Props {
    validationTarget: any,
    validationProperty: string,
    textArea: boolean,
    value: string,
    validationErrors: ValidationError[],
    pristine: boolean,
    onChange: (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => any,
    className: string
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
        console.log({
            validationTarget: this.props.validationTarget,
            validationProperty: this.props.validationProperty,
            validationErrors: this.props.validationErrors,
            valid: this.localValidationErrors.length === 0
        });
        return this.localValidationErrors.length === 0;
    }

    get classNames(): string {
        console.log(this.valid);
        if (this.props.className) {
            return this.props.className + (this.valid ? '' : ' error')
        } else {
            return this.valid ? '' : 'error'
        }
    }

    render() {

        if (!this.props.textArea) {
            return <input className={this.classNames} value={this.props.value} onChange={(event: ChangeEvent<HTMLInputElement>) => this.props.onChange(event)}/>
        } else {
            return <textarea className={this.classNames} value={this.props.value} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => this.props.onChange(event)}/>

        }

    }
}

export default ValidatableInput;
