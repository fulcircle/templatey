import React, {Component} from 'react';
import {ToRender} from "../../data/request/ToRender.class";

interface Props {
    template_text: string,
    changeText: Function,
}

class TextPane extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {

        return (
            <div className="text">
                <textarea value={this.props.template_text} onChange={(event) => this.props.changeText(event)} />
            </div>
        );
    }
}

export default TextPane;
