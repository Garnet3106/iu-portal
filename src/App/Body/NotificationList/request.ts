function requestNotificationRequest(onGranted: () => void) {
    if (Notification.permission !== 'granted') {
        onGranted();
    } else {
        Notification.requestPermission()
            .then((permission) => {
                if (permission === 'granted') {
                    onGranted();
                }
            });
    }
}

export default requestNotificationRequest;
