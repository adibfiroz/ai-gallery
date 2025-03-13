"use server";

import prismadb from "./prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { checkSubscription } from "./subscription";
import {
  MAX_DOWNLOAD_LIMIT,
  MAX_FREE_CAPTION_LIMIT,
  MAX_PRO_CAPTION_LIMIT,
} from "@/constants";

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

export const increaseTotalDownloadCount = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const download = await prismadb.user.findUnique({
    where: {
      id: currentUser.id,
    },
  });

  if (download) {
    await prismadb.user.updateMany({
      where: { id: currentUser.id },
      data: { downloads: download.downloads + 1 },
    });
  }
};

export const increaseFreeCaptionCount = async (credit: number) => {
  const currentUser = await getCurrentUser();
  const isSubscribed = await checkSubscription();
  const freeCount = await getFreeCaptionCount();

  if (!currentUser) {
    return;
  }

  if (!isSubscribed) {
    if (freeCount >= MAX_FREE_CAPTION_LIMIT) {
      throw new Error("subscribe!");
    }
  }

  const freeCaption = await prismadb.userDownloadLimit.findUnique({
    where: {
      userId: currentUser.id,
    },
  });

  if (freeCaption) {
    await prismadb.userDownloadLimit.updateMany({
      where: { userId: currentUser.id },
      data: { captionCount: freeCaption.captionCount + credit },
    });
  } else {
    await prismadb.userDownloadLimit.createMany({
      data: { userId: currentUser.id, captionCount: credit },
    });
  }
};

export const increaseProCaptionCount = async (credit: number) => {
  const currentUser = await getCurrentUser();
  const isSubscribed = await checkSubscription();
  const proCredits = await getProCaptionCount();

  if (!currentUser) {
    return;
  }

  if (!isSubscribed) {
    if (proCredits >= MAX_PRO_CAPTION_LIMIT) {
      throw new Error("subscribe!");
    }
  }

  const proCaption = await prismadb.userSubscription.findUnique({
    where: {
      userId: currentUser.id,
    },
  });

  if (proCaption) {
    await prismadb.userSubscription.updateMany({
      where: { userId: currentUser.id },
      data: { credits: proCaption.credits + credit },
    });
  } else {
    await prismadb.userSubscription.createMany({
      data: { userId: currentUser.id, credits: credit },
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

export const getFreeCaptionCount = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return 0;
  }

  const freeCaption = await prismadb.userDownloadLimit.findUnique({
    where: {
      userId: currentUser.id,
    },
  });

  if (!freeCaption) {
    return 0;
  }

  return freeCaption.captionCount;
};

export const getProCaptionCount = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return 0;
  }

  const proCaption = await prismadb.userSubscription.findUnique({
    where: {
      userId: currentUser.id,
    },
  });

  if (!proCaption) {
    return 0;
  }

  return proCaption.credits;
};
