import { ChevronDown, SettingsIcon, Users, XCircle } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface SeriesHeaderProps{
    name: string
}

export const SeriesHeader = ({name}: SeriesHeaderProps) => {
    const { onOpen } = useModal();
    return ( 
        <div className="">
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-non cursor-pointer" asChild>
                <div className="w-[600px] bg-black p-2">
                    <span className="text-indigo-700 font-bold text-3xl">{name}</span>
                    <ChevronDown size={55} className="text-white inline-block float-right pb-3"/>
                </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-100 text-xs font-medium text-white
                bg-black space-y-[2px]"
                >
                    <DropdownMenuItem
                        className='px-3 py-2 text-sm cursor-pointer hover:text-black hover:bg-white'
                    >
                        <SettingsIcon className="mr-4"></SettingsIcon>
                        <span>設定</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onOpen("addStreamer")}
                        className='px-3 py-2 text-sm cursor-pointer hover:text-black hover:bg-white'
                    >
                        <Users className="mr-4"></Users>
                        <span>ストリーマーの追加</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className=''/>
                    <DropdownMenuItem
                        
                        className='px-3 py-2 text-sm cursor-pointer text-rose-600 font-bold hover:text-rose-600 hover:bg-white'
                    >
                        <XCircle className="mr-4"></XCircle>
                        <span>時系列の削除</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
