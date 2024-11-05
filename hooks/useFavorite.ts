import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";
import { useLoginModal } from "./user-login-modal";
import { addFavorite, removeFavorite } from "@/app/actions/favorites";

interface IUseFavorite {
  imageId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ imageId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [effect, setEffect] = useState(false);
  const [effect2, setEffect2] = useState(false);

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(imageId);
  }, [currentUser, imageId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        loginModal.onOpen();
        return false;
      }

      try {
        let request;

        if (hasFavorited) {
          setEffect2(true);
          request = () => removeFavorite({ imageId });
        } else {
          setEffect(true);
          request = () => addFavorite({ imageId });
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
    [currentUser, hasFavorited, imageId, router, effect, effect2]
  );

  return {
    hasFavorited,
    toggleFavorite,
    effect,
    effect2,
  };
};

export default useFavorite;
