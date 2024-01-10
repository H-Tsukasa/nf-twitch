'use client';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/user';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { Unsubscribe, onAuthStateChanged } from 'firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation'

type UserContextType = User | null | undefined;

const AuthContext = createContext<UserContextType>(undefined);

// 以下を追加
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()

    const [user, setUser] = useState<UserContextType>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser): Promise<Unsubscribe> => {
            if (firebaseUser) {
                //docでユーザの情報取得
                const ref = doc(db, `users/${firebaseUser.uid}`);
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    const appUser = (await getDoc(ref)).data() as User;
                    setUser(appUser);
                } else {
                    const appUser: User = {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName!,
                        photoURL: firebaseUser.photoURL!,
                    };

                    setDoc(ref, appUser).then(() => {
                        setUser(appUser);
                    });
                }
            } else {
                setUser(null);
                router.refresh()
                router.push("/sign-in")
            }

            return unsubscribe;
        });
    }, []); //第二引数が空の場合は初回レンダリングのみの処理
    //childrenのすべての要素に認証情報を提供 authcontext.providerで子要素でuserが使えるように
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

//useContext(AuthContext)のみでも可能 hookであるため，アロー関数を使用
export const useAuth = () => useContext(AuthContext);
