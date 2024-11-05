"use server";

import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import { NextResponse } from "next/server";

export interface IFavoritesParams {
  imageId: string;
}

export const addFavorite = async (params: IFavoritesParams) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const { imageId } = params;

    if (!imageId || typeof imageId !== "string") {
      throw new Error("Invalid ID");
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])];

    favoriteIds.push(imageId);

    await prismadb.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favoriteIds,
      },
    });

    await prismadb.image.update({
      where: {
        id: imageId,
      },
      data: {
        userlikeIds: {
          push: currentUser?.id,
        },
      },
    });

    return "Favorite Added";
  } catch (error: any) {
    throw new Error(error);
  }
};

export const removeFavorite = async (params: IFavoritesParams) => {
  try {
    const currentUser = await getCurrentUser();

    const { imageId } = params;

    const getImage = await prismadb.image.findUnique({
      where: {
        id: imageId,
      },
    });

    if (!currentUser) {
      throw new Error("not authorised!");
    }

    if (!imageId || typeof imageId !== "string") {
      throw new Error("Invalid ID");
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])];

    favoriteIds = favoriteIds.filter((id) => id !== imageId);

    await prismadb.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favoriteIds,
      },
    });

    let userlikeIds = [...(getImage?.userlikeIds || [])];

    userlikeIds = userlikeIds.filter((id) => id !== currentUser?.id);

    await prismadb.image.update({
      where: {
        id: imageId,
      },
      data: {
        userlikeIds,
      },
    });

    return "Favorite Removed";
  } catch (error: any) {
    throw new Error(error);
  }
};
