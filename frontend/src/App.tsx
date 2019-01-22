import React, { Component } from 'react';
import './App.scss';
import {Api} from "./api/Api.class";
import {TemplateRender} from "./data/TemplateRender.interface";
import DOMPurify from 'dompurify'
import FieldPane from "./components/FieldPane/FieldPane";
import {ToRender} from "./data/ToRender.interface";

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
                {fields: [{name: 'var', value: 'TEST'}], template_text: '%%var%%'}
        }
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
                <FieldPane fields={this.state.toRender.fields} />
                <div className="textPane"></div>
                <div className="previewPane" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.rendered.template)}}></div>
            </div>
        );
    }
}

export default App;
