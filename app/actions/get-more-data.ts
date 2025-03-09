"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { TAKE } from "@/constants";
import { checkSubscription } from "@/lib/subscription";

interface ICollectionParams {
  collectionId: string;
  page?: number;
}

export interface IImageParams {
  orientation?: string;
  sort?: string;
  searchItem?: string;
  page: number;
}

export const getInitialImages = async (params: IImageParams) => {
  try {
    const { orientation, sort, searchItem } = params;
    const isSubscribed = await checkSubscription();

    let query: any = {};

    const validOrientations = ["landscape", "portrait", "square"] as const;
    if (validOrientations.includes(orientation as any)) {
      query.orientation = orientation as string;
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

    if (sort === "featured" && isSubscribed) {
      query.Pro = true;
    }

    let orderByQuery: any;

    if (sort === "newest") {
      orderByQuery = { createdAt: "desc" };
    } else if (!validOrientations.includes(orientation as any)) {
      orderByQuery = { views: "desc" };
    }
    const data = await prismadb.image.findMany({
      where: query,
      orderBy: orderByQuery,
      take: TAKE,
      skip: 0,
    });

    const safeImages = data.map((image) => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    }));
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return safeImages;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMoreImages = async (params: IImageParams) => {
  try {
    const { orientation, sort, searchItem, page } = params;

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

    if (sort === "featured") {
      query.Pro = true;
    }

    let orderByClause: any =
      sort === "newest"
        ? { createdAt: "desc" }
        : sort === undefined
        ? { views: "desc" }
        : undefined;

    const images = await prismadb.image.findMany({
      where: query,
      orderBy: orderByClause,
      take: TAKE,
      skip: (page - 1) * TAKE,
    });

    const totalImages = await prismadb.image.count({
      where: query,
      orderBy: orderByClause,
    });

    const hasMore = page && page * TAKE < totalImages;

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = images.map((image) => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    }));

    return { data, hasMore };
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

    const { collectionId, page } = params;

    const data = await prismadb.collection.findUnique({
      where: {
        id: collectionId,
        userId: currentUser?.id,
      },
      include: {
        images: {
          take: TAKE,
          skip: page && (page - 1) * TAKE,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const totalImages = await prismadb.image.count({
      where: {
        collectionIds: {
          has: collectionId, // ✅ Correct filtering for many-to-many relationship
        },
      },
    });

    const hasMore = page && page * TAKE < totalImages;
    const moreData = data?.images.map((image) => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    }));

    return { moreData, hasMore };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCollectionCardImages = async (params: ICollectionParams) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized!");
    }

    const { collectionId } = params;

    const data = await prismadb.collection.findUnique({
      where: {
        id: collectionId,
        userId: currentUser?.id,
      },
      include: {
        images: {
          take: 2,
          skip: 0,
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
    const { page } = params;

    const images = await prismadb.image.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds || [], // ✅ No unnecessary spread
        },
      },
      take: TAKE,
      skip: page ? (page - 1) * TAKE : 0, // ✅ Ensures a valid number for skip
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalImages = await prismadb.image.count({
      where: {
        id: {
          in: currentUser?.favoriteIds || [], // ✅ Same fix for count query
        },
      },
    });

    const hasMore = page && page * TAKE < totalImages;

    const data = images.map((image) => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    }));

    return { data, hasMore };
  } catch (error: any) {
    throw new Error(error);
  }
};
