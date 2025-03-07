'use client';

import { SafeUser } from "@/app/types";
import useFavorite from "../hooks/useFavorite";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchCurrentUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/hooks/store";
import { fetchSingleImage } from "@/store/slices/imageSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useLoginModal } from "@/hooks/user-login-modal";

interface HeartButtonProps {
    imageId: string
    currentUser?: SafeUser | null
    heart?: boolean
}

const HeartButton: React.FC<HeartButtonProps> = ({
    imageId,
    currentUser,
    heart
}) => {
    const { hasFavorited, isLoading, toggleFavorite } = useFavorite({
        imageId,
        currentUser
    });

    const router = useRouter()
    const dispatch = useAppDispatch();
    const [localFavorited, setLocalFavorited] = useState(hasFavorited);
    const loginModal = useLoginModal()

    useEffect(() => {
        setLocalFavorited(hasFavorited);
    }, [hasFavorited]);


    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();

        if (!currentUser) {
            if (heart) {
                router.back()
            }
            loginModal.onOpen();
            return
        }
        // Optimistically update local state
        setLocalFavorited(prev => !prev);

        try {
            await toggleFavorite(e);
        } catch (error) {
            // Revert state in case of an error
            setLocalFavorited(prev => !prev);
        }

        router.refresh()
        dispatch(fetchCurrentUser())
        // dispatch(fetchSingleImage({ imageId: imageId }))
    }

    return (
        <Button
            onClick={(e) => handleToggle(e)}
            className={cn("relative transition cursor-pointer bg-white rounded-full flex items-center justify-center size-10 p-0 hover:bg-white/80 shadow-2xl backdrop-blur-xl", isLoading && " pointer-events-none")}>
            <HeartIcon
                size={24}
                className={
                    localFavorited ? 'fill-[#ff0000] text-[#ff0000]' : 'text-[#384261]'
                }
            />
        </Button>
    );
}

export default HeartButton;