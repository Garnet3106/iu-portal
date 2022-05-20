import { initializeApp } from 'firebase/app';
import { AuthError, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import config from './config';

initializeApp(config);

const provider = new GoogleAuthProvider();
const auth = getAuth();

export function signInWithGoogle(onSucceed: (credintial: UserCredential) => void, onFail: (error: AuthError) => void) {
    signInWithPopup(auth, provider)
        .then(onSucceed)
        .catch(onFail);
}
