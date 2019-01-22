import {IsEmail} from "class-validator";

export class EmailFields {

    @IsEmail()
    from!: string;

    @IsEmail()
    to!: string;

    constructor(fields: EmailFields) {
        Object.assign(this, fields);
    }
}