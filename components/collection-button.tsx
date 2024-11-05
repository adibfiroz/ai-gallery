'use client';


import { SafeUser } from "@/app/types";

import { cn } from "@/lib/utils";
import useCollection from "@/hooks/useCollection";
import { Collection } from "@prisma/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useLoginModal } from "@/hooks/user-login-modal";

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
    const { hasFavorited, toggleCollection } = useCollection({
        imageId,
        currentUser,
        collection
    });

    const [localIsFavorite, setLocalIsFavorite] = useState(hasFavorited);
    const [isloading, setisLoading] = useState(false);
    const loginModal = useLoginModal()

    useEffect(() => {
        setLocalIsFavorite(hasFavorited);
    }, [hasFavorited, imageId, collection]);

    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!currentUser) {
            loginModal.onOpen();
            return
        }
        setisLoading(true)
        setLocalIsFavorite(!localIsFavorite)
        toggleCollection(e)
        setisLoading(false)
    }

    return (
        <Button
            onClick={handleToggle}
            className={cn("relative w-24 transition cursor-pointer bg-white rounded-md flex items-center justify-center text-white", localIsFavorite ? "bg-red-600 hover:bg-red-500" : "bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:opacity-70")}>
            {localIsFavorite ? "Remove" : "Add"}
        </Button>
    );
}

export default CollectionButton;