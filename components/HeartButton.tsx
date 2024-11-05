'use client';


import { SafeUser } from "@/app/types";

import useFavorite from "../hooks/useFavorite";
import { Heart, HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoginModal } from "@/hooks/user-login-modal";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
    imageId: string
    currentUser?: SafeUser | null
}

const HeartButton: React.FC<HeartButtonProps> = ({
    imageId,
    currentUser
}) => {
    const { hasFavorited, toggleFavorite } = useFavorite({
        imageId,
        currentUser
    });

    const [localIsFavorite, setLocalIsFavorite] = useState(hasFavorited);
    const loginModal = useLoginModal()
    const [isloading, setisLoading] = useState(false);

    useEffect(() => {
        setLocalIsFavorite(hasFavorited);
    }, [hasFavorited, imageId]);

    const handleToggle = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!currentUser) {
            loginModal.onOpen();
            return
        }
        setisLoading(true)
        setLocalIsFavorite(!localIsFavorite)
        toggleFavorite(e)
        setisLoading(false)
    }

    return (
        <div
            onClick={handleToggle}
            className={cn("relative transition cursor-pointer bg-white rounded-full flex items-center justify-center", isloading && " pointer-events-none")}>
            <HeartIcon
                size={24}
                className={
                    localIsFavorite ? 'fill-[#ff0000] text-[#ff0000] m-2' : 'text-[#384261] m-2'
                }
            />
        </div>
    );
}

export default HeartButton;