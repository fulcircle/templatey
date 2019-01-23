import {TemplateRenderResponse} from "../data/response/TemplateRenderResponse.interface";
import {ToRender} from "../data/request/ToRender.class";
import {EmailResponse} from "../data/response/EmailResponse.interface";
import {EmailFields} from "../data/request/EmailFields.class";

export class ResponseError {
    response: Response = new Response();

    constructor(responseError: ResponseError) {
        Object.assign(this, responseError);
    }
}

export class Api {

    static async render(toRender: ToRender): Promise<TemplateRenderResponse> {

        let json = await Api._post('/api/template/render', JSON.stringify({to_render: toRender}));

        return json as TemplateRenderResponse;
    }

    static async send_email(toRender: ToRender, emailFields: EmailFields): Promise<EmailResponse> {

        let postBody = {
            email_fields: emailFields,
            to_render: toRender
        };

        let json = await Api._post('/api/template/send', JSON.stringify(postBody));

        return json as EmailResponse;

    }

    static async _post(route: string, body: string) {

        let postData = {
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            method: 'post',
            body: body
        };

        let response = await fetch(route, postData);

        if (!response.ok) {
            throw new ResponseError({response: response});
        }

        return await response.json();

    }

}