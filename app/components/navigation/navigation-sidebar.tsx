"use client"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { useEffect, useState } from "react";

import { Series } from "@/types/series";
import { User } from "@/types/user";
import apiClient from "@/apiClient";
import { useAuth } from "@/context/auth";
import { useParams } from "next/navigation";

export const NavigationSidebar = () => {
    const user = useAuth() as User
    const params = useParams()
    const [series, setSeries] = useState<Series[]>([])
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            if(series.length==0){
                try {
                    const response = await apiClient.get<Series[]>(`/series/user_id/${user.id}`);
                    setSeries(response.data);
                } catch (err) {
                    setError("データの取得に失敗しました。");
                }
            }else if(params.seriesId){
                let flag = true
                series.map((s) => {
                    if(s.id==Number(params.seriesId)){
                        flag = false
                    }
                })
                if(flag){
                    try {
                        const response = await apiClient.get<Series[]>(`/series/user_id/${user.id}`);
                        setSeries(response.data);
                    } catch (err) {
                        setError("データの取得に失敗しました。");
                    }
                }
            }
        };
        fetchData();
    }, [params]);

    return (  <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
    <NavigationAction />
    <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
    <ScrollArea className="flex-1 w-full">
        {series.map((s) => (
        <div key={String(s.id)} className="mb-4">
            <NavigationItem
            id={s.id}
            name={s.name}
            imageUrl={s.thumbnail_url}
            />
        </div>
        ))}
    </ScrollArea>
    <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
    </div>
    </div> );
}