import { Component } from 'react';
import { JsonApi, JsonApiRequestActionKind } from '../../../jsonapi';
import { BodyProps } from '../Body';
import NotificationItem from './NotificationItem/NotificationItem';
import Notification, { notificationConvertors } from '../../../notification';
import './NotificationList.css';

if (!('serviceWorker' in navigator)) {
    alert('お使いのブラウザは通知機能に対応していません。');
}

type NotificationListState = {
    notifications: Notification[],
};

class NotificationList extends Component<BodyProps, NotificationListState> {
    private _isMounted: boolean;
    private _notifications: Notification[] | null;

    constructor(props: BodyProps) {
        super(props);

        this._isMounted = false;
        this._notifications = null;

        this.state = {
            notifications: [],
        };

        const onError = () => {
            console.error('Notification Error: Failed to load.');
        }

        const req = {
            actionKind: JsonApiRequestActionKind.GetNotifications,
            parameters: {},
            onSucceed: (_req: XMLHttpRequest, response: any) => {
                const notifications = response.contents.notifications.map((eachRawNotification: any) => notificationConvertors[eachRawNotification.kind](eachRawNotification));
                this.updateNotifications(notifications);
            },
            onBadRequest: onError,
            onFailToAuth: () => onError,
            onError: () => onError,
        };

        JsonApi.request(req);
    }

    render() {
        let notifications: JSX.Element[];

        if (this.state.notifications.length !== 0) {
            notifications = this.state.notifications.map((eachNotification: Notification) => 
                (<NotificationItem notification={eachNotification} key={`notificationItem_${eachNotification.id}`} />));
        } else {
            const initialNotification: Notification = {
                id: null,
                title: '通知画面へようこそ',
                date: null,
                description: '届いた通知はここに表示されます',
            };

            notifications = [
                (<NotificationItem notification={initialNotification} key="notificationItem_initial" />),
            ];
        }

        return (
            <div className="NotificationList body-component" id={this.props.page.toId()} style={this.props.style}>
                <div className="notification-list">
                    {notifications}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._notifications !== null) {
            this.setState({
                notifications: this._notifications,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateNotifications(notifications: Notification[]) {
        if (this._isMounted) {
            this.setState({
                notifications: notifications,
            });
        } else {
            this._notifications = notifications;
        }
    }
}

export default NotificationList;
