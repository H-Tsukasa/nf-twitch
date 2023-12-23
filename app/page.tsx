import type { NextPage } from "next";
import Head from "next/head";
import FetchItem from "@/components/FetchItem";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>FastAPI + Next.js + TypeScript</title>
                <meta
                    name="description"
                    content="FastAPI + Next.js + TypeScript のデモアプリケーション"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>FastAPI + Next.js + TypeScript</h1>

                <FetchItem itemId={1} />
            </main>

            <footer>
                <span>Powered by FastAPI, Next.js, and TypeScript</span>
            </footer>
        </div>
    );
};

export default Home;
