"use client";

import { checkoutCredits } from "@/lib/transaction.action";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { SafeUser } from "@/app/types";
import { useLoginModal } from "@/hooks/user-login-modal";
import { Button } from "./ui/button";
const inter = Inter({ subsets: ['latin'] })

const Checkout = ({
    plan,
    amount,
    credits,
    currentUser,
    isSubscribed
}: {
    plan: string;
    credits: number;
    amount: number;
    currentUser?: SafeUser | null,
    isSubscribed: boolean
}) => {

    const loginModal = useLoginModal();
    const onCheckout = async () => {

        if (!currentUser) {
            loginModal.onOpen();
            return
        }

        const transaction = {
            plan,
            amount,
            credits
        };

        await checkoutCredits(transaction);
    };

    return (
        <form action={onCheckout}>
            <section>
                <Button
                    type="submit"
                    className={cn("bg-teal-500 text-white shadow-sm hover:bg-teal-400 focus-visible:outline-teal-500 block rounded-md px-3.5 w-full text-center text-sm font-semibold focus-visible:outline h-10 focus-visible:outline-2 focus-visible:outline-offset-2 mt-8 sm:mt-10"
                    )}
                >
                    {isSubscribed ? "Manage Subscription" : "Subcribe"}
                </Button>
            </section>
        </form >
    );
};

export default Checkout;