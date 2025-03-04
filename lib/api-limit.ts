"use server";

import prismadb from "./prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { checkSubscription } from "./subscription";
import { MAX_DOWNLOAD_LIMIT } from "@/constants";

export const increaseFreeDownloadLimit = async () => {
  const currentUser = await getCurrentUser();
  const isSubscribed = await checkSubscription();
  const freeCount = await getFreeDownloadCount();

  if (!currentUser) {
    return;
  }

  if (!isSubscribed) {
    if (freeCount >= MAX_DOWNLOAD_LIMIT) {
      throw new Error("subscribe!");
    }
  }

  const freeDownload = await prismadb.userDownloadLimit.findUnique({
    where: {
      userId: currentUser.id,
    },
  });

  if (freeDownload) {
    await prismadb.userDownloadLimit.updateMany({
      where: { userId: currentUser.id },
      data: { count: freeDownload.count + 1 },
    });
  } else {
    await prismadb.userDownloadLimit.createMany({
      data: { userId: currentUser.id, count: 1 },
    });
  }
};

export const getFreeDownloadCount = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return 0;
  }

  const freeDownload = await prismadb.userDownloadLimit.findUnique({
    where: {
      userId: currentUser.id,
    },
  });

  if (!freeDownload) {
    return 0;
  }

  return freeDownload.count;
};
