"use client"
import { useAuth } from "@/context/auth";
import { OverlaySpinner } from "@/components/overlay-spinner";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Series } from "@/types/series";
import apiClient from "@/hooks/api-client";
import { User } from "@/types/user";
import { CalendarDays, Plus, Router } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

import { format, getDate, getMonth, getYear } from "date-fns"

import { ActionTooltip } from "@/components/action-tooltip";

const Home = () => {
    const user = useAuth() as User
    const router = useRouter()
    const { onOpen } = useModal();
    const [series, setSeries] = useState<Series[]>([])
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get<Series[]>(`/series/user_id/${user.id}`);
                setSeries(response.data);
            } catch (err) {
                setError("データの取得に失敗しました。");
            }
        };
        fetchData();
    }, [user]);
    if(!user){
        return <OverlaySpinner></OverlaySpinner>
    }

    const moveSeries = (series_id: Number) => {
        router.push(`/series/${series_id}`)
    }
    
    return (
        <div className="flex flex-wrap m-20 mt-28">
            <ActionTooltip side="top" align="start" label="追加する" >
                <button
                onClick={() => onOpen("createSeries")}
                className="group flex items-center"
                >
                <div className="flex mb-20 mr-20 p-2 h-[250px] w-[250px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                    <Plus
                    className="group-hover:text-white transition text-violet-600"
                    size={100}
                    />
                </div>
                </button>
            </ActionTooltip>
            {series.map((s) => (
                <div 
                key={String(s.id)} 
                className="mb-20 mr-20 h-[250px] w-[250px] p-5 rounded-[24px] transition-all border border-black border-opacity-30 hover:rounded-[16px]  overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 cursor-pointer hover:bg-emerald-500  relative top-0 right-0 hover:top-[-3px] hover:right-[5px] hover:shadow-md " 
                onClick={() => moveSeries(s.id)}
                >
                    {s.thumbnail_url ?(
                        <Image fill src={s.thumbnail_url} alt="Series" className="h-[50%] pt-6 rounded-[5px] " />
                    ):(
                        <div className="bg-violet-600 text-white w-auto text-center h-[50%] pt-6 rounded-[5px] text-5xl">{s.name[0].toUpperCase()}</div>
                    )}
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                        <div className="font-bold text-xl mt-3">{s.name}</div>
                        <div className="mt-2"><CalendarDays className= "h-4 w-4 opacity-60"></CalendarDays>{s.date_start.substr(0, s.date_start.indexOf("T"))} ~ {s.date_end.substr(0, s.date_end.indexOf("T"))}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home
