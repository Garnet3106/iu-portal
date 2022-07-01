import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import AppDispatcher from '../flux/AppDispatcher';
import { UiActionCreators } from '../flux/UiActionCreators';
import { apiResponseToAssignments, AssignmentStructureApiResponse, JsonApi, JsonApiRequestActionKind, toAssignmentStructureApiResponse } from '../jsonapi';
import requestNotificationRequest from './Body/NotificationList/request';
import { notificationConvertors } from '../notification';
import { getToken } from 'firebase/messaging';
import { firebaseMessaging, firebaseVapidKey } from '../firebase/firebase';
import { pageList, topPage } from '../page';
import './App.css';

// Initialize UI State.
AppDispatcher.dispatch(UiActionCreators.getDefault());
// Initialize Service Worker and signin database.
requestNotificationRequest(() => {
    const fcmRegTokenKey = 'fcm_reg_token';

    getToken(firebaseMessaging, {
        vapidKey: firebaseVapidKey,
    })
        .then((registrationToken) => {
            document.cookie = `${fcmRegTokenKey}=${registrationToken}; path=/`;
            signinDatabase();
        })
        .catch(() => {
            console.warn('Failed to initialize messaging feature.');
            document.cookie = `${fcmRegTokenKey}=; max-age=0`;
            signinDatabase();
        });
});

export function routePage() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const specifiedPageId = params.get('page');
    let targetPage;

    if (specifiedPageId !== null && specifiedPageId in pageList && pageList[specifiedPageId].isBodyComponent) {
        targetPage = pageList[specifiedPageId];
    } else {
        targetPage = topPage;
    }

    AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(targetPage));
};

function signinDatabase() {
    const req = {
        actionKind: JsonApiRequestActionKind.Signin,
        parameters: {},
        onSucceed: (_req: XMLHttpRequest, response: any) => {
            console.info('Service Worker: Push notification registered.');
            updateAssignments(response.contents.getAssignments);
            updateNotifications(response.contents.getNotifications);
            routePage();
        },
        onBadRequest: () => {},
        onFailToAuth: () => {
            console.error('User Auth Error: Failed to auth.');
        },
        onError: () => {},
    };

    JsonApi.request(req);
}

function updateAssignments(response: any) {
    let assignments = apiResponseToAssignments(toAssignmentStructureApiResponse(response as AssignmentStructureApiResponse));
    AppDispatcher.dispatch(UiActionCreators.updateAssignments(assignments));
}

function updateNotifications(response: any) {
    if (response.status !== 200) {
        console.error('Assignment Loading Error: Failed to get assignments.');
    }

    const notifications = response.contents.notifications.map((eachRawNotification: any) => notificationConvertors[eachRawNotification.kind](eachRawNotification));
    AppDispatcher.dispatch(UiActionCreators.updateNotifications(notifications));
}

class App extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <Header />
                <Body />
                <BottomMenu defaultPageName="AssignmentList" />
            </div>
        );
    }
}

export default App;
