'use client';
import { useAuth } from '@/context/auth';
import { login, logout, verify_token } from '@/lib/auth';
import { useState } from 'react';
import { auth } from '@/lib/firebase';

export default function Home() {
    const user = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);
    // const [token, setToken] = useState<string>('');
    //ログイン処理
    const signIn = async () => {
        setWaiting(true);
        //フロントエンド側で処理，tokenを取得
        await login()
            .catch((error) => {
                console.error(error?.code);
            })
            .then(async () => {
                setWaiting(false);
                await auth.currentUser?.getIdToken(true).then((idToken) => {
                    //サーバ側で認証
                    verify_token(idToken).catch((error) => {
                        logout();
                        console.error(error?.code);
                    });
                });
            });
    };

    return (
        <div>
            {user === null && !waiting && <button onClick={signIn}>ログイン</button>}
            {user && (
                <div>
                    <div>
                        {user.name}, {user.id}
                    </div>
                    <button onClick={logout}>ログアウト</button>
                </div>
            )}
        </div>
    );
}
