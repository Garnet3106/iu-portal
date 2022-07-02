import React from "react";
import { BodyProps } from "../Body";
import { GoogleAuthProvider, User, UserCredential } from "firebase/auth";
import { firebaseAuth, signInWithGoogle } from '../../../firebase/firebase';
import UiStore from "../../../flux/UiStore";
import App from "../../App";
import './Login.css';

export const googleAccessTokenKey = 'g_token';

class Login extends React.Component<BodyProps> {
    constructor(props: BodyProps) {
        super(props);

        firebaseAuth.onAuthStateChanged((user: User | null) => {
            const uiState = UiStore.getState();

            if (!uiState.hasSignedIn && user !== null) {
                this.onSignin(user);
            }
        });
    }

    render() {
        return (
            <div className="Login body-component" id={this.props.page.name} style={this.props.style}>
                <div className="login">
                    <div className="login-item" onClick={this.signinWithGoogle.bind(this)}>
                        <div className="login-item-icon fab fa-google" />
                        <div className="login-item-title">
                            Google でログイン
                        </div>
                    </div>
                    <div className="login-item" onClick={this.signinWithEmail.bind(this)}>
                        <div className="login-item-icon fa-regular fa-envelope" />
                        <div className="login-item-title">
                            メールアドレスでログイン
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
        signInWithGoogle((credential: UserCredential) => {
            const googleCredential = GoogleAuthProvider.credentialFromResult(credential);
            const token = googleCredential!.accessToken;
            this.onSignin(credential.user, token);
        }, () => {
            alert('Google アカウントの認証に失敗しました。');
        });
    }

    signinWithEmail() {
        alert('現在メールアドレスによるログインは対応していません。');
    }
}

export default Login;
