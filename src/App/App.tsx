import React, { createRef } from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import AppDispatcher from '../flux/AppDispatcher';
import { UiActionCreators } from '../flux/UiActionCreators';
import { apiResponseToAssignments, apiResponseToNotifications, AssignmentStructureApiResponse, JsonApi, JsonApiRequestActionKind, toAssignmentStructureApiResponse } from '../jsonapi';
import requestNotificationRequest from './Body/NotificationList/request';
import { getToken } from 'firebase/messaging';
import { firebaseAuth, firebaseMessaging, firebaseVapidKey } from '../firebase/firebase';
import { pageList, topPage } from '../page';
import { getRedirectResult, User } from 'firebase/auth';
import Settings from './Body/Settings/Settings';
import UiStore from '../flux/UiStore';
import { ActionKind } from '../flux/AppConstants';
import Localization from '../localization';
import './App.css';

export const switchAccountKey = 'switch_account';

export function searchCookieValue(searchKey: string): string | null {
    const cookiePairs = document.cookie.split('; ');
    let matchedValue: string | null = null;

    cookiePairs.some((eachPair: string) => {
        const [key, value] = eachPair.split('=');

        if (key === searchKey) {
            matchedValue = decodeURIComponent(value);
            return true;
        }

        return false;
    });

    return matchedValue;
}

class App extends React.Component<{}> {
    _isMounted: boolean;
    _willForceUpdate: boolean;
    static loadingScreen: React.RefObject<HTMLDivElement> = createRef();

    constructor(props: {}) {
        super(props);
        this._isMounted = false;
        this._willForceUpdate = false;

        UiStore.addListener(() => {
            const uiState = UiStore.getState();

            if (uiState.latestKind === ActionKind.UpdateSettingValues) {
                if (this._isMounted) {
                    this.forceUpdate();
                } else {
                    this._willForceUpdate = true;
                }
            }
        });
    }

    render() {
        return (
            <div className="App">
                <div className="app-loading" ref={App.loadingScreen}>
                    <div className="app-loading-logo">
                        iU Portal
                    </div>
                    <div className="circles-to-rhombuses-spinner">
                        <div className="circle" />
                        <div className="circle" />
                        <div className="circle" />
                    </div>
                </div>
                <Header />
                <Body />
                <BottomMenu defaultPageName="AssignmentList" />
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._willForceUpdate) {
            this.forceUpdate();
            this._willForceUpdate = false;
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    static initialize(user: User) {
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
                        console.info('Push notification is ready.');
                        document.cookie = `${fcmRegTokenKey}=${registrationToken}; path=/`;
                        App.signinDatabase(user);
                    })
                    .catch(() => {
                        console.error('Failed to initialize messaging feature.');
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

    static signinDatabase(user: User) {
        const onFailToSignin = () => {
            AppDispatcher.dispatch(UiActionCreators.failToSignin());
        };

        const req = {
            actionKind: JsonApiRequestActionKind.Signin,
            parameters: {},
            onSucceed: (_req: XMLHttpRequest, response: any) => {
                if (searchCookieValue(switchAccountKey) !== 'true') {
                    App.updateResponseData(response);
                    AppDispatcher.dispatch(UiActionCreators.signin());
                    App.routePage();
                } else {
                    // Keep showing login page to let user switch account.
                    AppDispatcher.dispatch(UiActionCreators.failToSignin());
                    document.cookie = `${switchAccountKey}=; path=/`;
                }
            },
            onBadRequest: onFailToSignin,
            onFailToAuth: (_req: XMLHttpRequest, response: any) => {
                if (response.message === 'user_not_found') {
                    const onAccountError = () => {
                        alert(Localization.getMessage('signin.error.cannot_use_this_account'));
                        onFailToSignin();
                    };

                    Settings.signout(onAccountError, () => {
                        console.error('Failed to signout.');
                        onAccountError();
                    });
                } else {
                    onFailToSignin();
                }

                console.error('Failed to auth user.');
            },
            onError: onFailToSignin,
        };

        // Wait for ID token update.
        getRedirectResult(firebaseAuth)
            .then(() => {
                user.getIdToken()
                    .then((idToken: string) => {
                        const firebaseIdTokenKey = 'id_token';
                        // todo: encryption
                        document.cookie = `${firebaseIdTokenKey}=${encodeURIComponent(idToken)}; path=/`;
                        JsonApi.request(req);
                    })
                    .catch(() => {
                        console.error('Failed to get auth information.');
                        AppDispatcher.dispatch(UiActionCreators.failToSignin());
                    });
            });
    }

    static hideLoadingScreen() {
        const loadingScreen = App.loadingScreen.current;

        if (loadingScreen !== null) {
            loadingScreen.style.opacity = '0';

            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        } else {
            console.error('Couldn\'t hide loading screen.');
        }
    }

    static updateResponseData(response: any) {
        const apiResponse = toAssignmentStructureApiResponse(response as AssignmentStructureApiResponse);
        const assignments = apiResponseToAssignments(apiResponse);
        const notifications = apiResponseToNotifications(apiResponse);
        AppDispatcher.dispatch(UiActionCreators.updateAssignments(assignments));
        AppDispatcher.dispatch(UiActionCreators.updateNotifications(notifications));
    }
}

export default App;
