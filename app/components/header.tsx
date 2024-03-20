"use client"
import Image from 'next/image';
import Link from 'next/link';
import { logout } from '@/lib/auth';

import { auth } from '@/lib/firebase';
import { useAuthUser } from '@react-query-firebase/auth';

import { LogOut, SettingsIcon } from 'lucide-react';

import { UserAvatar } from "@/components/user-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
    const user = useAuthUser(["user"], auth)
    return (
        <div className="flex bg-gray-700 h-[55px] fixed left-0 right-0 top-0 z-30 px-5">
            <Link href="/main">
                <Image src="/logo.svg" alt="logo" width={200} height={20} className="mt-2" priority={false}/>
            </Link>
            <div className="my-auto ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-non" asChild>
                        
                        {/* {user.data && user.data?.photoURL && (
                                <UserAvatar src={user.data.photoURL}/>
                            ) 
                        } */}
                        {/* {user.data && !user.data.photoURL && (
                                <div className='h-7 w-7 md:h-10 md:w-10 rounded-full bg-blue-700 text-center ali cursor-pointer text-white'>
                                    <div className="pt-[2px] md:pt-2">T</div>
                                </div>  
                            )
                        } */}
                        {user.data && user.data.displayName && (
                                <div className='h-7 w-7 md:h-10 md:w-10 rounded-full bg-blue-700 text-center ali cursor-pointer text-white'>
                                    <div className="pt-[2px] md:pt-2">{user.data.displayName[0]}</div>
                                </div>  
                            )
                        }

                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-40 text-xs font-medium text-white bg-black space-y-[2px]"
                    >
                        <DropdownMenuItem
                            onClick={logout}
                            className='px-3 py-2 text-sm cursor-pointer'
                        >
                            <LogOut className='mr-4'></LogOut>
                            <span>ログアウト</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className=''/>
                        <DropdownMenuItem>
                            <SettingsIcon className='mr-4'></SettingsIcon>
                            <span>設定</span>
                            </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
