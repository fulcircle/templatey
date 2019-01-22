import {TemplateRender} from "../data/TemplateRender.interface";
import {ToRender} from "../data/ToRender.interface";

export class Api {

    static async render(toRender: ToRender): Promise<TemplateRender> {
        let response = await fetch('/api/template/render',
        {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(toRender)
            });

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        let json = await response.json();

        return json as TemplateRender;
    }
}