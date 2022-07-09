import { Component } from 'react';
import { formatDate } from '../../../../assignment';
import Localization from '../../../../localization';
import { Notification } from "../../../../assignment";
import './NotificationItem.css';

type NotificationItemProps = {
    notification: Notification,
};

class NotificationItem extends Component<NotificationItemProps> {
    render() {
        const date = this.props.notification.date;
        const dateString = date !== null ? formatDate(date, 'M/d') : '';

        return (
            <div className="NotificationItem">
                <div className="notification-list-item-top">
                    <div className="notification-list-item-title">
                        {Localization.getMessage(`notification_list.kind.${this.props.notification.kind}`)}
                    </div>
                    <div className="notification-list-item-date">
                        {dateString}
                    </div>
                </div>
                <div className="notification-list-item-description">
                    {this.props.notification.description}
                </div>
            </div>
        );
    }
}

export default NotificationItem;
