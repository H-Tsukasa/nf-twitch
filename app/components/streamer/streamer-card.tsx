import { cn } from "@/lib/utils";
import { Streamer } from "@/types/streamer";

import Image from "next/image";

interface StreamerCardProps {
    streamer: Streamer;
    selected_id: Number | undefined;
} 

export const StreamerCard = ({streamer, selected_id}: StreamerCardProps) => {
    return (
        <div className={cn(
            "flex mb-3 mr-3 ml-3 p-3 border border-black border-opacity-50 bg-violet-200 hover:bg-violet-600 hover:text-white rounded-[4px] transition-all cursor-pointer",
            streamer.id === selected_id &&
                "bg-violet-600 text-white"
        )}>
            <div className="h-[60px] w-[60px] rounded-full group relative overflow-hidden">
                <Image sizes="500px" fill src={streamer.profile_image_url} alt={streamer.profile_image_url}/>
            </div>
            <div className="font-bold m-auto text-2xl overflow-hidden">
                {streamer.display_name}
            </div>
        </div>
    )
}