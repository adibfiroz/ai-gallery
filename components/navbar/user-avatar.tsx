
"use client";

import { SafeUser } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookmarkCheck, CircleDollarSign, CircleUserRound, LayoutDashboard, LogOut, Settings } from "lucide-react";
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
            <CircleUserRound className="text-stone-500" size={18} />
          </DropdownMenuItem>
        </Link>

        <Link href={`/profile/${formattedName}/collections`}>
          <DropdownMenuItem className=" flex gap-10 cursor-pointer px-3 py-2.5  justify-between">
            Collections
            <BookmarkCheck className="text-stone-500" size={18} />
          </DropdownMenuItem>
        </Link>

        <Link href="/pricing">
          <DropdownMenuItem className=" flex gap-10 cursor-pointer px-3 py-2.5 justify-between">
            Pricing
            <CircleDollarSign className="text-stone-500" size={18} />
          </DropdownMenuItem>
        </Link>

        <Link href={`/profile/${formattedName}/settings`}>
          <DropdownMenuItem className=" flex gap-10 cursor-pointer px-3 py-2.5 justify-between">
            Settings
            <Settings className="text-stone-500" size={18} />
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-[#ff4d88] cursor-pointer flex gap-10 px-3 py-2.5 justify-between">
          Logout
          <LogOut className=" text-[#ff4d88]" size={18} />
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>

  );
};