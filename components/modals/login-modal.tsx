"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoginModal } from "@/hooks/user-login-modal";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion"

export const LoginModal = () => {
  const [yanimate, setYAnimate] = useState(false)
  const loginModal = useLoginModal();

  useEffect(() => {
    setTimeout(() => {
      if (loginModal.isOpen) {
        setYAnimate(true)
      } else {
        setYAnimate(false)
      }
    }, 50);
  }, [loginModal.isOpen])

  return (
    <Dialog open={loginModal.isOpen} onOpenChange={loginModal.onClose}>
      <DialogContent className="max-w-lg w-[90%] sm:w-full !rounded-xl border-0 p-0 overflow-hidden">
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className="relative">
            <Image src="/galleryImg.png" className="h-[220px] object-top object-cover w-full" width={500} height={500} alt="galleryImg" />

            <div onClick={loginModal.onClose} className=" absolute size-8 right-2 top-2 cursor-pointer hover:opacity-80 bg-white rounded-full p-1">
              <X />
            </div>
          </motion.div>
          <div className={cn("flex flex-col justify-center p-4 transition-all duration-200 -mt-[150px]", yanimate && "-mt-0")}>
            <DialogTitle className=" text-center text-3xl font-bold mb-2">
              Login
            </DialogTitle>

            <div className=" w-full flex items-center justify-center my-5">
              <button onClick={() => signIn('google')} className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 transition-all duration-300 flex items-center gap-x-4 justify-center text-white hover:shadow-lg hover:shadow-teal-500/50 cursor-pointer rounded-lg py-3 px-6">
                <img src="/google.png" alt="google" width={30} height={30} />
                Continue with Google</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};