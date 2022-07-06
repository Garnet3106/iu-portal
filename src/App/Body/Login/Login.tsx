import React from "react";
import { BodyProps } from "../Body";
import { getRedirectResult, GoogleAuthProvider, User, UserCredential } from "firebase/auth";
import { firebaseAuth, signInWithGoogle } from '../../../firebase/firebase';
import App from "../../App";
import Localization from "../../../localization";
import './Login.css';

export const googleAccessTokenKey = 'g_token';

class Login extends React.Component<BodyProps> {
    constructor(props: BodyProps) {
        super(props);

        getRedirectResult(firebaseAuth)
            .then((credential: UserCredential | null) => {
                if (credential === null) {
                    App.hideLoadingScreen();
                    return;
                }

                const googleCredential = GoogleAuthProvider.credentialFromResult(credential);
                const token = googleCredential!.accessToken;
                this.onSignin(credential.user, token);
            })
            .catch(() => {
                console.warn('Trying to signin with cache...');
            });
    }

    render() {
        return (
            <div className="Login body-component" id={this.props.page.name} style={this.props.style}>
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

    onSignin(user: User, googleAccessToken?: string) {
        if (googleAccessToken !== undefined) {
            document.cookie = `${googleAccessTokenKey}=${encodeURIComponent(googleAccessToken)}; path=/`;
            App.initialize(user);
        }
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
