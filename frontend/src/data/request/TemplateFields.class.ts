import {Length} from "class-validator";

export class TemplateFields {

    @Length(1, 256, {groups: ['email', 'render']})
    name!: string;

    @Length(1, 256, {groups: ['email', 'render']})
    value!: string;

    constructor(fields: TemplateFields) {
        Object.assign(this, fields);
    }

}

