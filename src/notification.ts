import Localization from "./localization";

type Notification = {
    id: string | null,
    title: string,
    date: Date | null,
    description: string,
}

export const notificationConvertors: {
    [index: string]: (rawNotification: any) => Notification,
} = {
    'assignment_registration': (rawNotification: any) => {
        return {
            id: rawNotification.id,
            title: Localization.getMessage('notification_list.new_assignment'),
            date: new Date(rawNotification.date),
            description: rawNotification.value,
        };
    },
};

export default Notification;
