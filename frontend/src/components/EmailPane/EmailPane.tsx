import React, {ChangeEvent, Component} from 'react';

interface Props {
    from: string,
    to: string,
    sendEmail: Function,
    updateEmailFields: Function
}

class EmailPane extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {


        return (
            <div className="email">
                <div className="from_email">
                    <input value={this.props.from} onChange={ (event: ChangeEvent<HTMLInputElement>) => this.props.updateEmailFields(event.target.value, this.props.to) }/>
                </div>
                <div className="to_email">
                    <input value={this.props.to} onChange={ (event: ChangeEvent<HTMLInputElement>) => this.props.updateEmailFields(this.props.from, event.target.value) }/>
                </div>
                <div className="render_button" onClick={ () => this.props.sendEmail() }>
                    SEND
                </div>
            </div>
        )
    }
}

export default EmailPane;
