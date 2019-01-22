import React, {ChangeEvent, Component} from 'react';
import './App.scss';
import {Api} from "./api/Api.class";
import {TemplateRender} from "./data/TemplateRender.interface";
import DOMPurify from 'dompurify'
import FieldPane from "./components/FieldPane/FieldPane";
import {ToRender} from "./data/ToRender.interface";
import TextPane from "./components/TextPane/TextPane";

interface State {
    rendered: TemplateRender,
    toRender: ToRender

}

class App extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {rendered: {
                template:  "",
                template_name: ""
            },
            toRender:
                {fields: [], template_text: ''}
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

    render() {
        return (
            <div className="App">
                <div className="EditorPane">
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

                    <div className="render_button" onClick={() => this.renderTemplate()}>
                        RENDER
                    </div>
                </div>

                <div className="previewPane" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.rendered.template)}}></div>

            </div>
        );
    }
}

export default App;
