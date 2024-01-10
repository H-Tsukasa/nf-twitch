'use client';
import { useAuth } from '@/context/auth';
import { login, logout, verify_token } from '@/lib/auth';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { redirect } from "next/navigation";

import { OverlaySpinner } from "@/components/OverlaySpinner"

const SignIn = () => {
    const user = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);
    // 既にログインしている場合はmainページに遷移
    if (user) {
        return redirect('/main');
    }
    //ログイン処理
    const signIn = async () => {
        setWaiting(true);
        //フロントエンド側で処理，tokenを取得
        await login()
            .then(async () => {
                await auth.currentUser?.getIdToken(true).then((idToken) => {
                    //サーバ側で認証
                    verify_token(idToken).catch((error) => {
                        logout();
                        console.error(error?.code);
                    });
                });
                setWaiting(false);
            })
            .catch((error) => {
                console.error(error?.code);
            });
    };
    return (
        <div>
            {user === null && !waiting && (
                <div>
                    <div className="text-rose-500 font-bold text-3xl mt-8">
                        アプリを利用するにはログインが必要です
                    </div>
                    <div
                        onClick={signIn}
                        className="rounded-2xl bg-sky-400 hover:bg-sky-600 transition-all text-3xl font-bold text-white text-center p-3 mt-8 cursor-pointer"
                    >
                        Googleアカウントでログイン
                    </div>
                </div>
            )}
            {waiting && (
                <div>
                    <OverlaySpinner></OverlaySpinner>
                </div>
            )}
        </div>
    );
};

export default SignIn;
