import { Component } from 'react';
import { formatDate } from '../../../../assignment';
import Notification from '../../../../notification';
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
                        {this.props.notification.title}
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
