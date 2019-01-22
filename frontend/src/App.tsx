import React, {ChangeEvent, Component} from 'react';
import './App.scss';
import {Api} from "./api/Api.class";
import {TemplateRender} from "./data/TemplateRender.interface";
import DOMPurify from 'dompurify'
import FieldPane from "./components/FieldPane/FieldPane";
import {ToRender} from "./data/ToRender.interface";
import TextPane from "./components/TextPane/TextPane";
import {EmailFields} from "./data/EmailFields.interface";
import EmailPane from "./components/EmailPane/EmailPane";

interface State {
    rendered: TemplateRender,
    toRender: ToRender
    emailFields: EmailFields
}

class App extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            rendered: { template: "", template_name: "" },
            toRender: { fields: [], template_text: '' },
            emailFields: { from: "", to: "" }
        }
    }

    addField() {
        let toRender = {...this.state.toRender};
        toRender.fields.push({name: "", value: ""});
        this.setState({toRender: toRender});
    }

    removeField(idx: number) {
        let toRender = {...this.state.toRender};
        toRender.fields.splice(idx, 1);
        this.setState({toRender: toRender});
    }

    onTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
        let toRender = {...this.state.toRender};
        toRender.template_text = event.target.value;
        this.setState({toRender: toRender})
    }

    onFieldChange(event: ChangeEvent<HTMLInputElement>, idx: number, property: string) {
        let toRender = {...this.state.toRender};

        if (property == 'value')  {
            toRender.fields[idx].value = event.target.value;
        } else if (property == 'name') {
            toRender.fields[idx].name = event.target.value;
        }

        this.setState({toRender: toRender});
    }

    componentDidMount(): void {
        this.renderTemplate();
    }

    async renderTemplate() {
        let rendered = await Api.render(this.state.toRender);
        this.setState({rendered: rendered})
    }

    updateEmailFields(from: string, to: string) {
        let emailFields = {from: from, to: to};
        this.setState({emailFields: emailFields})
    }

    async sendEmail() {
        await Api.send_email(this.state.toRender, this.state.emailFields);
    }

    render() {
        return (
            <div className="App">
                <div className="editor_pane">
                    <FieldPane
                        fields={this.state.toRender.fields}
                        addField={() => this.addField()}
                        removeField={(idx: number) => this.removeField(idx)}
                        changeField={(event: ChangeEvent<HTMLInputElement>, idx: number, property: string) => this.onFieldChange(event, idx, property)}
                    />

                    <TextPane
                        text={this.state.toRender.template_text}
                        changeText={(event: ChangeEvent<HTMLTextAreaElement>) => this.onTextChange(event)}
                    />
                </div>

                <EmailPane
                    from={this.state.emailFields.from}
                    to={this.state.emailFields.to}
                    sendEmail={ () => this.sendEmail() }
                    updateEmailFields={ (from: string, to: string) => this.updateEmailFields(from, to)}
                />

                <div className="render_button" onClick={ () => this.renderTemplate() }>
                    RENDER
                </div>

                <div className="preview_pane" dangerouslySetInnerHTML={ {__html: DOMPurify.sanitize(this.state.rendered.template)} } />

            </div>
        );
    }
}

export default App;
