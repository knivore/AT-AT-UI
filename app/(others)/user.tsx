'use client';

import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown_menu';
import React from 'react';
import {useSession} from 'next-auth/react';
import {LogOut, Mail} from "lucide-react";
import {useRouter} from "next/navigation";
import {handleLogout} from "@/app/(others)/logout";

export function User() {
    const {data: session, status} = useSession();
    const user = session?.user;
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
                <Image
                    src={user?.image ?? '/images/profile_logo.png'}
                    width={48}
                    height={48}
                    alt="Avatar"
                    className="rounded-full"
                />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {user?.name ?? 'Guest'}
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 bg-white shadow-lg rounded-md border">
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <a href="mailto:cpf-cds-cdwp@cpf.gov.sg"
                       className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                        <Mail className="h-4 w-4"/>
                        <span>Email Support</span>
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <button onClick={() => handleLogout(router)}
                            className="flex items-center gap-2 w-full text-left text-sm text-red-600 hover:text-red-800">
                        <LogOut className="h-4 w-4"/>
                        <span>Logout</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
