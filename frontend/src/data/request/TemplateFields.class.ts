import {Matches, MaxLength, MinLength} from "class-validator";

export class TemplateFields {

    @MaxLength(256, {
        groups: ['email', 'render'],
        message: 'Field names cannot be longer than 256 characters'
    })
    @Matches(/^[A-Za-z_][A-Za-z0-9_]*$/, {
        groups: ['email', 'render'],
        message: 'Field names can only start with a letter or underscore and can only contain alphanumeric characters and underscore.'
    })
    @MinLength(1, {
        groups: ['email', 'render'],
        message: 'You must specify a field name'
    })
    name: string = "";

    @MaxLength(256, {
        groups: ['email', 'render'],
        message: 'Field values cannot be longer than 256 characters'
    })
    @MinLength(1, {
        groups: ['email', 'render'],
        message: 'You must specify a field value'
    })
    value: string = "";

    constructor(fields: TemplateFields) {
        Object.assign(this, fields);
    }

}

