'use strict';

self.addEventListener('push', (event) => {
    const notification = event.data.json().notification;
    const title = notification.title;
    const body = notification.body;

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: 'lib/notification/icon_192.png',
            tag: 'push-notification-tag',
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    clients.openWindow("/");
}, false);
