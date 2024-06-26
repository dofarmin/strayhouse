import { MouseEvent, useState } from "react";
import axios from "axios";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const [hasFavorited, setFavorited] = useState<boolean>(
    (currentUser?.favoriteIds || []).includes(listingId)
  );
  const loginModal = useLoginModal();
  const router = useRouter();
  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) return loginModal.onOpen();

      try {
        let request;

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
          setFavorited(false);
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
          setFavorited(true);
        }
        await request();
        router.refresh();
        if(!hasFavorited){

          toast.success("sucess favorite");
        }

        else{

          toast.success("unfavorite");
        }

      } catch (error) {
        
        toast.error("Something went wrong.");

        setFavorited((prev) => !prev);
      }
    },
    [currentUser, loginModal, listingId, hasFavorited]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
