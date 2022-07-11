import React from "react";
import { BodyProps } from "../Body";
import { User } from "firebase/auth";
import { firebaseAuth, signInWithGoogle } from '../../../firebase/firebase';
import App from "../../App";
import Localization from "../../../localization";
import UiStore from "../../../flux/UiStore";
import { ActionKind } from "../../../flux/AppConstants";
import AppDispatcher from "../../../flux/AppDispatcher";
import { UiActionCreators } from "../../../flux/UiActionCreators";
import './Login.css';

initializeLoginPage();

function initializeLoginPage() {
    firebaseAuth.onAuthStateChanged((user: User | null) => {
        if (user === null) {
            AppDispatcher.dispatch(UiActionCreators.failToSignin());
            return;
        }

        App.initialize(user);
    });

    UiStore.addListener(() => {
        const uiState = UiStore.getState();

        switch (uiState.latestKind) {
            case ActionKind.Signin:
            case ActionKind.FailToSignin: {
                App.hideLoadingScreen();
            } break;
        }
    });
}

class Login extends React.Component<BodyProps> {
    render() {
        return (
            <div className="Login body-component" id={this.props.page.name} style={this.props.style}>
                <div className="login-service">
                    <div className="login-service-catchphrase">
                        {Localization.getMessage('service.catchphrase')}
                    </div>
                    <div className="login-service-name">
                        {Localization.getMessage('service.name')}
                    </div>
                </div>
                <div className="login">
                    <div className="login-item" onClick={this.signinWithGoogle.bind(this)}>
                        <div className="login-item-icon fab fa-google" />
                        <div className="login-item-title">
                            {Localization.getMessage('signin.with.google')}
                        </div>
                    </div>
                    <div className="login-item" onClick={this.signinWithEmail.bind(this)}>
                        <div className="login-item-icon fa-regular fa-envelope" />
                        <div className="login-item-title">
                            {Localization.getMessage('signin.with.email')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    signinWithGoogle() {
        signInWithGoogle(() => {}, () => {
            alert(Localization.getMessage('signin.error.failed_to_auth_with_google_account'));
        });
    }

    signinWithEmail() {
        alert(Localization.getMessage('signin.error.not_support_signin_with_email_temporary'));
    }
}

export default Login;
