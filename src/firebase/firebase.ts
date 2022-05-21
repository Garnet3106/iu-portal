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

export function signInWithGoogle(onSucceed: (credintial: UserCredential) => void, onFail: (error: AuthError) => void) {
    signInWithPopup(firebaseAuth, provider)
        .then(onSucceed)
        .catch(onFail);
}

export function hashWithSha256(str: string): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject: (reason: any) => void) => {
        const encodedStr = new TextEncoder().encode(str);

        crypto.subtle.digest('SHA-256', encodedStr)
            .then((buff) => {
                const hash = Array.from(new Uint8Array(buff)).map((v) => v.toString(16).padStart(2, '0')).join('');
                resolve(hash);
            })
            .catch((reason: any) => {
                reject(reason);
            });
    });
}
