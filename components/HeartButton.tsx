'use client';

import { SafeUser } from "@/app/types";
import useFavorite from "../hooks/useFavorite";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchCurrentUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/hooks/store";
import { fetchSingleImage } from "@/store/slices/imageSlice";

interface HeartButtonProps {
    imageId: string
    currentUser?: SafeUser | null
}

const HeartButton: React.FC<HeartButtonProps> = ({
    imageId,
    currentUser
}) => {
    const { hasFavorited, isLoading, toggleFavorite } = useFavorite({
        imageId,
        currentUser
    });

    const dispatch = useAppDispatch();

    const handleToggle = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        toggleFavorite(e)
        dispatch(fetchCurrentUser())
        dispatch(fetchSingleImage({ imageId: imageId }))
    }

    return (
        <div
            onClick={handleToggle}
            className={cn("relative transition cursor-pointer bg-white rounded-full flex items-center justify-center size-10 shadow-2xl backdrop-blur-xl", isLoading && " pointer-events-none")}>
            <HeartIcon
                size={24}
                className={
                    hasFavorited ? 'fill-[#ff0000] text-[#ff0000]' : 'text-[#384261]'
                }
            />
        </div>
    );
}

export default HeartButton;