import React from "react";
import { BodyProps } from "../Body";
import UiStore from "../../../flux/UiStore";
import { AuthError, UserCredential } from "firebase/auth";
import { signInWithGoogle } from '../../../firebase/firebase';
import './Login.css';

const iuEmailDomain = 'i-u.ac.jp';

class Login extends React.Component<BodyProps> {
    private _isMounted: boolean;

    constructor(props: BodyProps) {
        super(props);

        this._isMounted = false;

        UiStore.addListener(() => {
            const uiState = UiStore.getState();
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
                    <div className="login-item">
                        <div className="login-item-icon fa-regular fa-envelope" />
                        <div className="login-item-title">
                            メールアドレスでログイン
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    signInWithGoogle() {
        const onSucceed = (credintial: UserCredential) => {
            // fix: ドメイン判断のセキュリティ対策
            if (!credintial.user.email?.endsWith(iuEmailDomain)) {
                alert('このアカウントは利用できません。');

                credintial.user.delete()
                    .then(() => {
                        alert('アカウントが無効にされました。');
                    });

                return;
            }


        };

        const onFail = (error: AuthError) => {
            alert('Google アカウントの認証に失敗しました。');
        };

        signInWithGoogle(onSucceed, onFail);
    }
}

export default Login;
