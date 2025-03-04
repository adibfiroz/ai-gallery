"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { checkSubscription } from "@/lib/subscription";

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

    const imagesLikedByUser = await prismadb.image.findMany({
      where: {
        userlikeIds: {
          has: currentUser?.id,
        },
      },
    });

    for (const image of imagesLikedByUser) {
      await prismadb.image.update({
        where: { id: image.id },
        data: {
          userlikeIds: {
            set: image.userlikeIds.filter((id) => id !== currentUser?.id),
          },
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

export const dailyLimit = async () => {
  try {
    const currentUser = await getCurrentUser();
    const isSubscribed = await checkSubscription();

    if (!currentUser) {
      return null;
    }

    if (!isSubscribed) {
      const user = await prismadb.userDownloadLimit.findUnique({
        where: { userId: currentUser?.id },
      });

      if (!user) {
        return null;
      }

      const today = new Date();
      const lastUploadDate = new Date(user.updatedAt);

      // Check if it's a new day
      const isNewDay = today.toDateString() !== lastUploadDate.toDateString();

      if (isNewDay) {
        // Reset count for the new day
        const updatedUser = await prismadb.userDownloadLimit.update({
          where: { userId: currentUser?.id },
          data: { count: 0, updatedAt: today },
        });
        return updatedUser.count;
      }
    }

    // Return current count if it's still the same day
    return "credit reset";
  } catch (error: any) {
    throw new Error(error);
  }
};
