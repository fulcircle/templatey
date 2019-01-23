import {IsEmail} from "class-validator";

export class EmailFields {

    @IsEmail({}, {
        groups: ['email'],
        message: 'You must specify a "from" email'
    })
    from!: string;

    @IsEmail({}, {
        groups: ['email'],
        message: 'You must specify a "to" email'
    })
    to!: string;

    constructor(fields: EmailFields) {
        Object.assign(this, fields);
    }
}