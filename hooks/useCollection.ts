import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";
import { useLoginModal } from "./user-login-modal";
import { Collection } from "@prisma/client";
import {
  addImagetoCollection,
  removeImagetoCollection,
} from "@/app/actions/collection";

interface IUseCollection {
  imageId: string;
  collection?: Collection | null;
  currentUser?: SafeUser | null;
}

const useCollection = ({
  imageId,
  collection,
  currentUser,
}: IUseCollection) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = collection?.imageIds || [];

    return list.includes(imageId);
  }, [collection, imageId]);

  const toggleCollection = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        loginModal.onOpen();
        return false;
      }

      try {
        let request;

        if (hasFavorited) {
          request = () =>
            removeImagetoCollection({ imageId, collectionId: collection?.id });
        } else {
          request = () =>
            addImagetoCollection({ imageId, collectionId: collection?.id });
        }

        await request();
        // router.refresh();
      } catch (error) {
        toast.error("Something went wrongs!", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    },
    [collection, currentUser, hasFavorited, imageId, router]
  );

  return {
    hasFavorited,
    toggleCollection,
  };
};

export default useCollection;
