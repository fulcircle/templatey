import {Length, ValidateNested} from "class-validator";

import {TemplateFields} from "./TemplateFields.class";

export class ToRender {

    @Length(1)
    template_text!: string;

    @ValidateNested()
    template_fields!: Array<TemplateFields>;

    constructor(toRender: ToRender) {
        Object.assign(this, toRender);
    }

}

