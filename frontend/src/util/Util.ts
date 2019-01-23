import {ValidationError} from "class-validator";

export class Util {

    static flattenErrors(arr: Array<ValidationError>) {
        return Util._flattenErrors(arr, []);
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
