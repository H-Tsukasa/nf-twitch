import './globals.css';
import { Inter } from 'next/font/google';

import { AuthProvider } from '@/context/auth';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ModalProvider } from '@/components/providers/modal-provider';

import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'nf-twitch',
    description: 'このアプリケーションは，ストリーマー同士の時系列を作成，確認できるアプリケーションnf-twitchです．',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    storageKey="nf-theme"
                >
                    <AuthProvider>
                        <Header />
                        <ModalProvider />
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
