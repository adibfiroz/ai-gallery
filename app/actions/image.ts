"use server";

import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

enum Orients {
  landscape = "landscape",
  portrait = "portrait",
  square = "square",
}

export interface ICreateImageParams {
  caption: string;
  img: string;
  orientation: Orients;
  tags: string[];
}

interface IImageIdParams {
  imageId?: string;
}

interface IImageCollectionIdParams {
  name?: string;
  imageId?: string;
  collectionId?: string;
}

export const CreateImage = async (params: ICreateImageParams) => {
  try {
    const { caption, img, orientation, tags } = params;

    const image = await prismadb.image.create({
      data: {
        ...params,
      },
    });

    return image;
  } catch (error: any) {
    return null;
  }
};

export const increamentViewsCount = async (params: IImageIdParams) => {
  try {
    const { imageId } = params;

    const imageViews = await prismadb.image.findUnique({
      where: {
        id: imageId,
      },
    });

    if (imageViews) {
      await prismadb.image.update({
        where: { id: imageId },
        data: { views: imageViews?.views + 1 },
      });
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const increamentDownloads = async (params: IImageIdParams) => {
  try {
    const { imageId } = params;

    const imageDownload = await prismadb.image.findUnique({
      where: {
        id: imageId,
      },
    });

    if (imageDownload) {
      await prismadb.image.update({
        where: { id: imageId },
        data: { downloads: imageDownload?.downloads + 1 },
      });
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
