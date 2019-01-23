import {MinLength, ValidateNested, IsArray, MaxLength} from "class-validator";
import {Type} from "class-transformer"
import {TemplateFields} from "./TemplateFields.class";

export class ToRender {

    @MaxLength(50000, {
        groups: ['email', 'render'],
        message: "The text message cannot be greater than 50,000 characters"
    })
    @MinLength(1, {
        groups: ['email', 'render'],
        message: "You must specify some text for the template"
    })
    template_text!: string;

    @IsArray({groups: ['email', 'render']})
    @ValidateNested({each: true, groups: ['email', 'render']})
    @Type(() => TemplateFields)
    template_fields!: TemplateFields[];

    constructor(toRender: ToRender) {
        Object.assign(this, toRender);
    }

}

