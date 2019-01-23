import {Length, ValidateNested, IsArray} from "class-validator";
import {Type} from "class-transformer"
import {TemplateFields} from "./TemplateFields.class";

export class ToRender {

    @Length(1, undefined, {groups: ['email', 'render']})
    template_text!: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => TemplateFields)
    template_fields!: TemplateFields[];

    constructor(toRender: ToRender) {
        Object.assign(this, toRender);
    }

}

