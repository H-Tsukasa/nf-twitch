"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { logout } from '@/lib/auth';

import { UserAvatar } from "@/components/user-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
    const user = useAuth()
    return (
        <div className="flex bg-gray-700 h-[55px]">
            <Link href="/main">
                <Image src="/logo.svg" alt="logo" width={200} height={20} className="mt-2" priority={false}/>
            </Link>
            <div className="my-auto ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-non" asChild>
                        
                        {/* {user && user?.photoURL && (
                                <UserAvatar src={user.photoURL}/>
                            ) */}
                        {/* }    */}
                        {user && !user?.photoURL && (
                                <div className='h-7 w-7 md:h-10 md:w-10 rounded-full bg-blue-700 text-center ali cursor-pointer text-white'>
                                    <div className="pt-[2px] md:pt-2">{user?.name[0]}</div>
                                </div>  
                            )
                        }
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-40 text-xs font-medium text-black
                    dark:text-neutral-400 space-y-[2px]"
                    >
                        <DropdownMenuItem
                            onClick={logout}
                            className='px-3 py-2 text-sm cursor-pointer'
                        >
                            ログアウト
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className=''/>
                        <DropdownMenuItem>設定</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
