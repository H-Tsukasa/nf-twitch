import { GoogleAuthProvider, signInWithPopup, UserCredential, signOut } from 'firebase/auth';
import { auth } from './firebase';
import qs from 'query-string';
import axios from 'axios';

export const login = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export const logout = async (): Promise<void> => {
    return signOut(auth);
};

export const verify_token = async (token: string): Promise<void> => {
    const url = qs.stringifyUrl({
        url: '/api/verify',
    });
    const values = {
        token: token,
    };
    //uidが一致するかどうか検証
    await axios
        .post(url, values)
        .then((response) => {
            if (response.data.uid == auth.currentUser?.uid) {
                console.log('Backend側の認証成功');
            } else {
                console.log('認証失敗');
                logout();
            }
        })
        .catch((error) => {
            console.log(error?.code);
        });
};
