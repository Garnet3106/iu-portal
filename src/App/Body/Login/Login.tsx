import React from "react";
import { BodyProps } from "../Body";
import UiStore, { Page } from "../../../flux/UiStore";
import AppDispatcher from "../../../flux/AppDispatcher";
import { UiActionCreators } from "../../../flux/UiActionCreators";
import { AuthError, GoogleAuthProvider, User, UserCredential } from "firebase/auth";
import { firebaseAuth, hashWithSha256, signInWithGoogle } from '../../../firebase/firebase';
import './Login.css';

const iuEmailPattern = /\d{2}im\d{4}@i-u\.ac\.jp/;

class Login extends React.Component<BodyProps> {
    private _isMounted: boolean;
    private _isLoggedIn: boolean;

    constructor(props: BodyProps) {
        super(props);

        this._isMounted = false;
        this._isLoggedIn = false;

        UiStore.addListener(() => {
            const uiState = UiStore.getState();
        });

        firebaseAuth.onAuthStateChanged((user: User | null) => {
            if (user === null || this._isLoggedIn) {
                return;
            }

            this.onSignedIn(user);
        });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    render() {
        return (
            <div className="Login body-component" id={this.props.page.toId()} style={this.props.style}>
                <div className="login">
                    <div className="login-item" onClick={this.signInWithGoogle}>
                        <div className="login-item-icon fab fa-google" />
                        <div className="login-item-title">
                            Google でログイン
                        </div>
                    </div>
                    <div className="login-item" onClick={this.signInWithEmail}>
                        <div className="login-item-icon fa-regular fa-envelope" />
                        <div className="login-item-title">
                            メールアドレスでログイン
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onSignedIn(user: User) {
        // fix: ドメイン判断のセキュリティ対策
        if (!user.email?.match(iuEmailPattern)) {
            // Prevent from freezing the popup by alerting a message.
            setTimeout(() => {
                alert('このアカウントは利用できません。');

                user.delete()
                    .then(() => {
                        alert('アカウントが無効にされました。');
                    });
            }, 0);

            return;
        }

        // const googleCredential = GoogleAuthProvider.credentialFromResult(credintial);

        // hashWithSha256(googleCredential?.accessToken!)
        //     .then((tokenHash) => {
        //         document.cookie = `g_t=${tokenHash}; Secure`;
        //     })
        //     .catch((reason) => {
        //         alert(reason);
        //     });

        AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(new Page(1, 'AssignmentList')));
    }

    signInWithGoogle() {
        const onSucceed = (credintial: UserCredential) => {
            this.onSignedIn(credintial.user);
        };

        const onFail = (_error: AuthError) => {
            alert('Google アカウントの認証に失敗しました。');
        };

        signInWithGoogle(onSucceed, onFail);
    }

    signInWithEmail() {
        alert('現在メールアドレスによるログインは対応していません。');
    }
}

export default Login;
