"use server";

import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import { checkSubscription } from "@/lib/subscription";
import {
  MAX_FREE_COLLECTION_LIMIT,
  MAX_PRO_COLLECTION_LIMIT,
} from "@/constants";

interface ICreateCollectionParams {
  name: string;
}

interface IImageCollectionIdParams {
  name?: string;
  imageId?: string;
  collectionId?: string;
}

export const createCollection = async (params: ICreateCollectionParams) => {
  try {
    const currentUser = await getCurrentUser();
    const isSubscribed = await checkSubscription();

    const { name } = params;

    if (!currentUser) {
      throw new Error("Unauthorized!");
    }

    const collections = await prismadb.collection.findMany({
      where: {
        userId: currentUser?.id,
      },
    });

    if (!isSubscribed) {
      if (collections.length >= MAX_FREE_COLLECTION_LIMIT) {
        throw new Error(
          "max limit reached for creating collections on free plan!"
        );
      }
    }

    if (isSubscribed) {
      if (collections.length >= MAX_PRO_COLLECTION_LIMIT) {
        throw new Error(
          "max limit reached for creating collections on paid plan!"
        );
      }
    }

    const collectionName = collections.find(
      (collection) => collection.name.toLowerCase() === name.toLowerCase()
    );

    if (collectionName) {
      throw new Error("Folder already exists!");
    }

    await prismadb.collection.createMany({
      data: {
        name,
        userId: currentUser.id,
      },
    });

    return { message: "Folder created" };
  } catch (error: any) {
    throw new Error("Something went wrong!");
  }
};

export const getCollection = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized!");
    }

    const collection = await prismadb.collection.findMany({
      where: {
        userId: currentUser?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!currentUser) {
      return null;
    }

    return collection;
  } catch (error: any) {
    return null;
  }
};

export const addImagetoCollection = async (
  params: IImageCollectionIdParams
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized!");
    }

    const { collectionId, imageId } = params;

    const updatedCollection = await prismadb.collection.update({
      where: {
        id: collectionId,
        userId: currentUser?.id,
      },
      data: {
        images: {
          connect: { id: imageId },
        },
      },
    });

    return updatedCollection;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

export const removeImagetoCollection = async (
  params: IImageCollectionIdParams
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized!");
    }

    const { collectionId, imageId } = params;

    const updatedCollection = await prismadb.collection.update({
      where: {
        id: collectionId,
        userId: currentUser?.id,
      },
      data: {
        images: {
          disconnect: { id: imageId },
        },
      },
    });

    return updatedCollection;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

export const deleteCollection = async (params: IImageCollectionIdParams) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized!");
    }

    const { collectionId, imageId } = params;

    const deleteCollection = await prismadb.collection.delete({
      where: {
        id: collectionId,
        userId: currentUser?.id,
      },
    });

    return deleteCollection;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

export const updateCollection = async (params: IImageCollectionIdParams) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized!");
    }

    const { collectionId, name, imageId } = params;

    const updatedCollection = await prismadb.collection.update({
      where: {
        id: collectionId,
        userId: currentUser?.id,
      },
      data: {
        name: name,
      },
    });

    return updatedCollection;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};
