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
import { deleteUser, User } from 'firebase/auth';
import Settings from './Body/Settings/Settings';
import UiStore from '../flux/UiStore';
import { ActionKind } from '../flux/AppConstants';
import Localization from '../localization';
import './App.css';

class App extends React.Component<{}> {
    _isMounted: boolean;

    constructor(props: {}) {
        super(props);
        this._isMounted = false;

        UiStore.addListener(() => {
            const uiState = UiStore.getState();

            if (this._isMounted && uiState.latestKind === ActionKind.UpdateSettingValues) {
                this.forceUpdate();
            }
        });
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

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    static initialize(user?: User) {
        // Initialize UI State.
        AppDispatcher.dispatch(UiActionCreators.getDefault());

        const fcmRegTokenKey = 'fcm_reg_token';

        // Initialize Service Worker and signin database.
        if (typeof Notification !== 'undefined') {
            requestNotificationRequest(() => {
                getToken(firebaseMessaging, {
                    vapidKey: firebaseVapidKey,
                })
                    .then((registrationToken) => {
                        document.cookie = `${fcmRegTokenKey}=${registrationToken}; path=/`;
                        App.signinDatabase(user);
                    })
                    .catch(() => {
                        console.warn('Failed to initialize messaging feature.');
                        document.cookie = `${fcmRegTokenKey}=; max-age=0`;
                        App.signinDatabase(user);
                    });
            });
        } else {
            App.signinDatabase(user);
        }
    }

    static routePage() {
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

    static signinDatabase(user?: User) {
        const req = {
            actionKind: JsonApiRequestActionKind.Signin,
            parameters: {},
            onSucceed: (_req: XMLHttpRequest, response: any) => {
                console.info('Service Worker: Push notification registered.');
                AppDispatcher.dispatch(UiActionCreators.signin());
                App.updateAssignments(response.contents.getAssignments);
                App.updateNotifications(response.contents.getNotifications);
                App.routePage();
            },
            onBadRequest: () => {},
            onFailToAuth: (_req: XMLHttpRequest, response: any) => {
                if (user !== undefined && response.message == 'external_email_address_provided')
                {
                    deleteUser(user)
                        .then(() => {
                            Settings.signout(() => {
                                alert(Localization.getMessage('signin.error.cannot_use_this_account'));
                            });
                        });
                }

                console.error('User Auth Error: Failed to auth.');
            },
            onError: () => {},
        };

        JsonApi.request(req);
    }

    static updateAssignments(response: any) {
        let assignments = apiResponseToAssignments(toAssignmentStructureApiResponse(response as AssignmentStructureApiResponse));
        AppDispatcher.dispatch(UiActionCreators.updateAssignments(assignments));
    }

    static updateNotifications(response: any) {
        if (response.status !== 200) {
            console.error('Assignment Loading Error: Failed to get assignments.');
        }

        const notifications = response.contents.notifications.map((eachRawNotification: any) => notificationConvertors[eachRawNotification.kind](eachRawNotification));
        AppDispatcher.dispatch(UiActionCreators.updateNotifications(notifications));
    }
}

App.initialize();

export default App;
