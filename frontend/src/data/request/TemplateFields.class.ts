import {Length, Matches, MaxLength, MinLength} from "class-validator";

export class TemplateFields {

    @MinLength(1, {groups: ['email', 'render']})
    @MaxLength(256, {groups: ['email', 'render']})
    @Matches(/[A-Za-z_]+.*/)
    name!: string;

    @MinLength(1, {groups: ['email', 'render']})
    @MaxLength(256, {groups: ['email', 'render']})
    value!: string;

    constructor(fields: TemplateFields) {
        Object.assign(this, fields);
    }

}

