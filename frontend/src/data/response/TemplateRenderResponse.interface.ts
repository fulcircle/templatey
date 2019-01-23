export class TemplateRenderResponse {

    template_name!: string;
    template!: string;

    constructor(templateRenderResponse: TemplateRenderResponse) {
        Object.assign(this, templateRenderResponse);
    }
}