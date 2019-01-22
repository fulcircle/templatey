import {TemplateRender} from "../data/TemplateRender.interface";
import {ToRender} from "../data/ToRender.interface";
import {EmailResponse} from "../data/EmailResponse.interface";
import {EmailFields} from "../data/EmailFields.interface";

export class Api {

    static async render(toRender: ToRender): Promise<TemplateRender> {

        let json = await Api._post('/api/template/render', JSON.stringify({to_render: toRender}));

        return json as TemplateRender;
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
            throw new Error(response.statusText);
        }

        return await response.json();

    }

}