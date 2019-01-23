export class TemplateError {
    has_error!: boolean;
    error_msg!: string;

    constructor(templateError: TemplateError) {
        Object.assign(this, templateError);
    }
}
export class TemplateRenderResponse {

    template_error!: TemplateError;
    template_name!: string;
    template!: string;

    constructor(templateRenderResponse: TemplateRenderResponse) {
        Object.assign(this, templateRenderResponse);
    }
}