
"use client";

import { SafeUser } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleDollarSign, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserAvatarProps {
  currentUser?: SafeUser | null
}

export const UserAvatar = ({
  currentUser
}: UserAvatarProps) => {

  const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" outline-none border hover:border-teal-500 rounded-full">
        <img
          className="rounded-full cursor-pointer text-[8px]"
          height="40"
          width="40"
          alt={"avatar"}
          src={currentUser?.image || '/user.png'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" rounded-lg">
        <Link href={`/profile/${formattedName}`}>
          <DropdownMenuItem className=" flex gap-10 cursor-pointer px-3 py-2.5  justify-between">
            Profile
            <LayoutDashboard size={18} />
          </DropdownMenuItem>
        </Link>

        <Link href="/pricing">
          <DropdownMenuItem className=" flex gap-10 cursor-pointer px-3 py-2.5 justify-between">
            Pricing
            <CircleDollarSign size={18} />
          </DropdownMenuItem>
        </Link>

        <Link href={`/profile/${formattedName}/settings`}>
          <DropdownMenuItem className=" flex gap-10 cursor-pointer px-3 py-2.5 justify-between">
            Settings
            <Settings size={18} />
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-[#ff4d88] cursor-pointer flex gap-10 px-3 py-2.5 justify-between">
          Logout
          <LogOut className=" text-[#ff4d88]" size={18} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className=" text-[11px] hover:bg-transparent text-blue-gray-400">
          <Link href="/terms">Terms </Link>
          <span className="px-1">•</span>
          <Link href="/privacy"> Privacy policy</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
};