'use client';
import { useAuth } from '@/context/auth';
import { login, logout, verify_token } from '@/lib/auth';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { redirect } from "next/navigation";
import Image from 'next/image';

import { OverlaySpinner } from "@/components/overlay-spinner"

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
                    <div className="font-bold text-3xl mt-32">
                        <Image src="/logo.svg" alt="logo" width={1000} height={1000} className="mt-1" priority={false}/>
                        <div className='text-center text-4xl'>ストリーマー同士の配信・クリップを簡単に確認</div>
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
