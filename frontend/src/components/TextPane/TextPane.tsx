import React, {Component} from 'react';

interface Props {
    text: string,
    changeText: Function,
}

class TextPane extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {

        return (
            <div className="text">
                <textarea value={this.props.text} onChange={(event) => this.props.changeText(event)} />
            </div>
        );
    }
}

export default TextPane;
