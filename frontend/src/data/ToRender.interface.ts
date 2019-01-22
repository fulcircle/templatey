import {TemplateField} from "./TemplateField.interface";

export interface ToRender {
    template_text: string;
    fields: Array<TemplateField>
}

