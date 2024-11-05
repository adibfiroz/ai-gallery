"use server";

import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export const deleteUser = async () => {
  try {
    const currentUser = await getCurrentUser();

    const subscriber = await prismadb.userSubscription.findUnique({
      where: {
        userId: currentUser?.id,
      },
      select: {
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
      },
    });

    const apiLimit = await prismadb.userDownloadLimit.findUnique({
      where: {
        userId: currentUser?.id,
      },
    });

    if (subscriber) {
      await prismadb.userSubscription.delete({
        where: {
          userId: currentUser?.id,
        },
      });
    }

    if (apiLimit) {
      await prismadb.userDownloadLimit.delete({
        where: {
          userId: currentUser?.id,
        },
      });
    }

    await prismadb.user.delete({
      where: {
        id: currentUser?.id,
      },
    });

    return "Your account has been deleted";
  } catch (error: any) {
    throw new Error(error);
  }
};
