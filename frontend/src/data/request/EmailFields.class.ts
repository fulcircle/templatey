import {IsEmail} from "class-validator";

export class EmailFields {

    @IsEmail({}, {groups: ['email']})
    from!: string;

    @IsEmail({}, {groups: ['email']})
    to!: string;

    constructor(fields: EmailFields) {
        Object.assign(this, fields);
    }
}