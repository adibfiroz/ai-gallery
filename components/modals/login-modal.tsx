"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoginModal } from "@/hooks/user-login-modal";
import Image from "next/image";
import { signIn } from "next-auth/react";


export const LoginModal = () => {
  const loginModal = useLoginModal();

  return (
    <Dialog open={loginModal.isOpen} onOpenChange={loginModal.onClose}>
      <DialogContent className="max-w-3xl w-[90%] sm:w-full !rounded-xl border-0 p-0 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="hidden sm:block">
            <Image src="/galleryImg.png" width={500} height={500} alt="galleryImg" />
          </div>
          <div className="flex flex-col justify-center py-10 sm:py-0 p-4">
            <DialogTitle className=" text-center text-3xl font-bold mb-2">
              Login
            </DialogTitle>

            <div className=" w-full flex items-center justify-center mt-5">
              <button onClick={() => signIn('google')} className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 flex items-center gap-x-4 justify-center text-white shadow-lg shadow-teal-500/50 cursor-pointer rounded-lg py-3 px-6">
                <img src="/google.png" alt="google" width={30} height={30} />
                Continue with Google</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};