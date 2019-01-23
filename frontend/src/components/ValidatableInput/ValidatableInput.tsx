import React, {ChangeEvent, Component, ReactElement} from 'react';
import {ValidationError} from "class-validator";
import {Util} from "../../util/Util";
import './ValidatableInput.scss'

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
        // console.log({
        //     validationTarget: this.props.validationTarget,
        //     validationProperty: this.props.validationProperty,
        //     validationErrors: this.props.validationErrors,
        //     valid: this.localValidationErrors.length === 0,
        //     pristine: this.props.pristine
        // });
        return this.localValidationErrors.length === 0 || this.props.pristine;
    }

    get classNames()  {
        let classes = [];
        if (this.props.className) {
            classes = [this.props.className,  this.errorClass]
        } else {
            classes = [this.errorClass]
        }

        return classes.join(" ");
    }

    get errorClass() {
        return this.valid ? '' : 'error'
    }

    render() {

        let errors: any = [];

        if (!this.valid) {
            errors = this.localValidationErrors.map((error, idx) => {
                return Util.extractErrorMessages(error).map((error) => {
                    return <div className={this.errorClass} key={idx}>{error}</div>
                });
            });
        }

        if (!this.props.textArea) {
            return (
                <div>
                    <input className={"input " + this.classNames}
                           value={this.props.value}
                           onChange={(event: ChangeEvent<HTMLInputElement>) => this.props.onChange(event)}/>
                    {errors}
                </div>
            )
        } else {
            return (
                <div>
                <textarea className={"textarea " + this.classNames}
                          value={this.props.value}
                          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => this.props.onChange(event)}/>
                    {errors}
                </div>
            )

        }

    }
}

export default ValidatableInput;
