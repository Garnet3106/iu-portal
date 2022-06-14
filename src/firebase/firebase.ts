import { initializeApp } from 'firebase/app';
import { AuthError, getAuth, browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup, UserCredential, signInWithCustomToken } from "firebase/auth";
import config from './config';

initializeApp(config);

const provider = new GoogleAuthProvider();
export const firebaseAuth = getAuth();

setPersistence(firebaseAuth, browserLocalPersistence)
    .catch((error) => {
        alert(`${error.code}: ${error.message}`)
    });

export function signInWithGoogle(onSucceed: (credential: UserCredential) => void, onFail: (error: AuthError) => void) {
    signInWithPopup(firebaseAuth, provider)
        .then(onSucceed)
        .catch(onFail);
}
