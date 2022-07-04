import Localization from "./localization";

type Notification = {
    id: string | null,
    kind: string,
    date: Date | null,
    description: string,
}

export const notificationConvertors: {
    [index: string]: (rawNotification: any) => Notification,
} = {
    'assignment_registration': (rawNotification: any) => {
        return {
            id: rawNotification.id,
            kind: 'new_assignment',
            date: new Date(rawNotification.date),
            description: rawNotification.value,
        };
    },
};

export default Notification;
