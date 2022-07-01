import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import AppDispatcher from '../flux/AppDispatcher';
import { UiActionCreators } from '../flux/UiActionCreators';
import { apiResponseToAssignments, JsonApi, JsonApiRequestActionKind, toAssignmentStructureApiResponse } from '../jsonapi';
import requestNotificationRequest from './Body/NotificationList/request';
import { getToken } from 'firebase/messaging';
import { firebaseMessaging, firebaseVapidKey } from '../firebase/firebase';
import { pageList, topPage } from '../page';
import './App.css';

// Initialize UI State.
AppDispatcher.dispatch(UiActionCreators.getDefault());
// Initialize Service Worker.
initializeCloudMessaging();

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

export function updateAssignments(onUpdate: () => void = () => {}) {
    const onSucceed = (_req: XMLHttpRequest, response: any) => {
        let assignments = apiResponseToAssignments(toAssignmentStructureApiResponse(response));
        AppDispatcher.dispatch(UiActionCreators.updateAssignments(assignments));
        onUpdate();
    };

    const onFailToAuth = (_req: XMLHttpRequest, response: any) => {
        console.error('User Auth Error: Failed to auth.');

        if (response.message === 'Cannot use external Google account.') {
            alert('このアカウントは利用できません。\n大学が発行した Google アカウントでログインし直してください。');
        }
    };

    const onFail = () => {
        console.error('Assignment Loading Error: Failed to get assignments.');
    };

    JsonApi.request({
        actionKind: JsonApiRequestActionKind.GetAssignments,
        parameters: {},
        onSucceed: onSucceed,
        onBadRequest: onFail,
        onFailToAuth: onFailToAuth,
        onError: onFail,
    });
}

function initializeCloudMessaging() {
    requestNotificationRequest(() => {
        getToken(firebaseMessaging, {
            vapidKey: firebaseVapidKey,
        })
            .then((registrationToken) => {
                document.cookie = `fcm_reg_token=${registrationToken}; path=/`;

                const req = {
                    actionKind: JsonApiRequestActionKind.Signin,
                    parameters: {},
                    onSucceed: () => {
                        console.info('Service Worker: Push notification registered.');
                    },
                    onBadRequest: () => {},
                    onFailToAuth: () => {
                        console.error('User Auth Error: Failed to auth.');
                    },
                    onError: () => {},
                };

                JsonApi.request(req);
            })
            .catch(() => {
                console.error('Notification Error: Failed to initialize messaging feature.');
            });
    });
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
