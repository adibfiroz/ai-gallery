'use client';


import { SafeUser } from "@/app/types";

import { cn } from "@/lib/utils";
import useCollection from "@/hooks/useCollection";
import { Collection } from "@prisma/client";
import { Button } from "./ui/button";
import { fetchCollections } from "@/store/slices/collectionSlice";
import { useAppDispatch } from "@/hooks/store";
import { Bookmark } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] })
interface CollectionButtonProps {
    imageId: string
    currentUser?: SafeUser | null
    collection?: Collection | null;
}

const CollectionButton: React.FC<CollectionButtonProps> = ({
    imageId,
    currentUser,
    collection
}) => {
    const { hasFavorited, isloading, toggleCollection } = useCollection({
        imageId,
        currentUser,
        collection
    });

    const dispatch = useAppDispatch();

    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        toggleCollection(e)
        dispatch(fetchCollections())
    }

    return (
        <div className={cn(' rounded-lg flex items-center justify-between bg-gray-100 shadow-md border border-stone-900/10 pr-2 gap-x-4', inter.className)}>
            <div className="flex items-center truncate pl-4">
                {hasFavorited ?
                    <Button className='p-0 shadow-none h-auto bg-transparent rounded-full hover:bg-transparent mt-1'>
                        <Bookmark size={22} className={cn("fill-blue-700 text-blue-700")} />
                    </Button>
                    : <Button className='p-0 shadow-none h-auto bg-transparent rounded-full hover:bg-transparent mt-1'>
                        <Bookmark size={22} className={cn("text-blue-700")} />
                    </Button>
                }
                <div className=' truncate px-4 py-3 text-[16px]'>{collection?.name}</div>
            </div>
            <Button
                disabled={isloading}
                onClick={handleToggle}
                className={cn("relative w-24 transition cursor-pointer bg-white rounded-md flex items-center justify-center text-white", hasFavorited ? "bg-red-600 hover:bg-red-500" : "bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:opacity-80")}>
                {isloading ?
                    <img src="/btn-loading.gif" width={20} height={20} alt="loader" />
                    :
                    <>
                        {hasFavorited ? "Remove" : "Add"}
                    </>
                }
            </Button>
        </div>
    );
}

export default CollectionButton;