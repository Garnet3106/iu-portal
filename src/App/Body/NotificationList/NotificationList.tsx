import { Component } from 'react';
import { BodyProps } from '../Body';
import NotificationItem from './NotificationItem/NotificationItem';
import Notification from '../../../notification';
import UiStore from '../../../flux/UiStore';
import { ActionKind } from '../../../flux/AppConstants';
import './NotificationList.css';
import Localization from '../../../localization';

// Notification service is available on https only except on localhost.

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

        UiStore.addListener(() => {
            const uiState = UiStore.getState();

            if (uiState.latestKind === ActionKind.UpdateNotifications) {
                this.updateNotifications(uiState.notifications);
            }
        });
    }

    render() {
        let notifications: JSX.Element[];

        if (this.state.notifications.length !== 0) {
            notifications = this.state.notifications.map((eachNotification: Notification) => 
                (<NotificationItem notification={eachNotification} key={`notificationItem_${eachNotification.id}`} />));
        } else {
            const initialNotification: Notification = {
                id: null,
                title: Localization.getMessage('notification_list.welcome_to_notification_list'),
                date: null,
                description: Localization.getMessage('notification_list.arrived_notifications_are_displayed_here'),
            };

            notifications = [
                (<NotificationItem notification={initialNotification} key="notificationItem_initial" />),
            ];
        }

        return (
            <div className="NotificationList body-component" id={this.props.page.name} style={this.props.style}>
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
