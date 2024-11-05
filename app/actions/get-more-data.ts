"use server";

import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

interface ICollectionParams {
  collectionId: string;
  take: number;
  skip: number;
}

export interface IImageParams {
  orientation?: string;
  sort?: string;
  take: number;
  skip: number;
  searchItem?: string;
}

export const getMoreImages = async (params: IImageParams) => {
  try {
    const { orientation, sort, take, skip, searchItem } = params;

    let query: any = {};

    if (query) {
      query.orientation = orientation;
    }

    if (searchItem) {
      query = {
        ...query,
        OR: [
          { caption: { contains: searchItem, mode: "insensitive" } },
          { tags: { hasSome: searchItem.split(",") } },
        ],
      };
    }

    let orderByClause: any =
      sort === "newest"
        ? { createdAt: "desc" }
        : sort === undefined && { views: "desc" };

    const data = await prismadb.image.findMany({
      where: query,
      orderBy: orderByClause,
      take: take,
      skip: skip,
    });

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const moreCollectionImages = async (params: ICollectionParams) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized!");
    }

    const { collectionId, take, skip } = params;

    const data = await prismadb.collection.findUnique({
      where: {
        id: collectionId,
        userId: currentUser?.id,
      },
      include: {
        images: {
          take,
          skip,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const moreData = (data && data?.images) || [];

    return moreData;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMoreFavoriteImages = async (params: IImageParams) => {
  try {
    const currentUser = await getCurrentUser();
    const { take, skip } = params;

    const favorites = await prismadb.image.findMany({
      where: {
        id: {
          in: [...(currentUser?.favoriteIds || [])],
        },
      },
      take: take,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    return favorites;
  } catch (error: any) {
    throw new Error(error);
  }
};
