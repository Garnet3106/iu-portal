import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';
import { AuthError, getAuth, browserLocalPersistence, GoogleAuthProvider, setPersistence, UserCredential, signInWithRedirect } from "firebase/auth";
import config from './config';

const firebaseApp = initializeApp(config);

export const firebaseProvider = new GoogleAuthProvider();
export const firebaseAuth = getAuth();
export const firebaseMessaging = getMessaging(firebaseApp);
export const firebaseVapidKey = 'BGmlnTnVr3Qv0YNMXhg5W2KeBGTUC2I5gQxc_UttlJefYeTBHbdRCamf8haT-O8J8fkGqUEaThvzeicmkZJVCvk';

setPersistence(firebaseAuth, browserLocalPersistence)
    .catch((error) => {
        alert(`${error.code}: ${error.message}`)
    });

export function signInWithGoogle(onSucceed: (credential: UserCredential) => void = () => {}, onFail: (error: AuthError) => void = () => {}) {
    signInWithRedirect(firebaseAuth, firebaseProvider)
        .then(onSucceed)
        .catch(onFail);
}

export default firebaseApp;
