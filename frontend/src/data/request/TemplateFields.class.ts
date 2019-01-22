import {Length} from "class-validator";

export class TemplateFields {

    @Length(1, 256)
    name!: string;

    @Length(1, 256)
    value!: string;

    constructor(fields: TemplateFields) {
        Object.assign(this, fields);
    }

}

