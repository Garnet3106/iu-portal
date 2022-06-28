type Notification = {
    id: string | null,
    title: string,
    date: string,
    description: string,
}

export const notificationConvertors: {
    [index: string]: (rawNotification: any) => Notification,
} = {
    'assignment_registration': (rawNotification: any) => {
        return {
            id: rawNotification.id,
            title: '新しい課題',
            date: rawNotification.date,
            description: rawNotification.value,
        };
    },
};

export default Notification;
