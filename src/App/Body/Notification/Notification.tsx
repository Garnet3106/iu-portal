import { Component } from 'react';
import { BodyProps } from '../Body';
import './Notification.css';

if (!('serviceWorker' in navigator)) {
    alert('お使いのブラウザは通知機能に対応していません。');
}

class Notification extends Component<BodyProps> {
    private _isMounted: boolean;

    constructor(props: BodyProps) {
        super(props);
        this._isMounted = false;
    }

    render() {
        return (
            <div className="Notification body-component" id={this.props.page.toId()} style={this.props.style}>
                Notification
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}

export default Notification;
