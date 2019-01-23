import {ValidationError} from "class-validator";

export class Util {

    static flattenErrors(arr: Array<ValidationError>) {
        return Util._flattenErrors(arr, []);
    }

    static extractErrorMessages(validationError: ValidationError) {
        let error_msgs = [];

        for (let property in validationError.constraints) {
            if (validationError.constraints.hasOwnProperty(property)) {
                error_msgs.push(validationError.constraints[property]);
            }
        }

        return error_msgs;
    }

    private static _flattenErrors(arr: Array<ValidationError>, state: ValidationError[]) {

        arr.forEach((error) => {
            if (error.children.length > 0) {
                Util._flattenErrors(error.children, state)
            } else {
                state.push(error)
            }
        });

        return state;
    }
}
