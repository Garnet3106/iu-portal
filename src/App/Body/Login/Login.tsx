import React from "react";
import { BodyProps } from "../Body";
import { Page } from "../../../flux/UiStore";
import AppDispatcher from "../../../flux/AppDispatcher";
import { UiActionCreators } from "../../../flux/UiActionCreators";
import { GoogleAuthProvider, User, UserCredential } from "firebase/auth";
import { firebaseAuth, signInWithGoogle } from '../../../firebase/firebase';
import { updateAssignments } from "../../App";
import './Login.css';

class Login extends React.Component<BodyProps> {
    private _isLoggedIn: boolean;

    constructor(props: BodyProps) {
        super(props);

        this._isLoggedIn = false;

        firebaseAuth.onAuthStateChanged(() => {
            if (this._isLoggedIn) {
                return;
            }

            this.onSignedIn();
        });
    }

    render() {
        return (
            <div className="Login body-component" id={this.props.page.toId()} style={this.props.style}>
                <div className="login">
                    <div className="login-item" onClick={this.signInWithGoogle.bind(this)}>
                        <div className="login-item-icon fab fa-google" />
                        <div className="login-item-title">
                            Google でログイン
                        </div>
                    </div>
                    <div className="login-item" onClick={this.signInWithEmail.bind(this)}>
                        <div className="login-item-icon fa-regular fa-envelope" />
                        <div className="login-item-title">
                            メールアドレスでログイン
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onSignedIn(googleAccessToken?: string) {
        if (googleAccessToken !== undefined) {
            document.cookie = `g_token=${encodeURIComponent(googleAccessToken)}`;
        }

        updateAssignments(() => {
            AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(new Page(1, 'AssignmentList')));
        });
    }

    signInWithGoogle() {
        signInWithGoogle((credential: UserCredential) => {
            const googleCredential = GoogleAuthProvider.credentialFromResult(credential);
            const token = googleCredential!.accessToken;

            this.onSignedIn(token);
        }, () => {
            alert('Google アカウントの認証に失敗しました。');
        });
    }

    signInWithEmail() {
        alert('現在メールアドレスによるログインは対応していません。');
    }
}

export default Login;
