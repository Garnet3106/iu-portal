'use strict';

const titles = {
    'assignment_registration': '新しい課題',
};

self.addEventListener('push', (event) => {
    const data = event.data.json().data;
    const title = titles[data['kind']];
    const body = data['course_name'];

    self.registration.showNotification(title, {
        body: body,
        icon: 'lib/notification/icon_192.png',
        tag: 'push-notification-tag',
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    clients.openWindow('/?page=NotificationList');
}, false);
