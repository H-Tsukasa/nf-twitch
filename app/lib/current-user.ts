// firebase認証によるユーザの確認
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const currentUser = async () => {
    const auth = getAuth();
    let re_user = null;
    onAuthStateChanged(auth, (user) => {
        try {
            if (user) {
                re_user = user.uid;
            }
        } catch (error) {
            return null;
        }
    });
    return re_user;
};
