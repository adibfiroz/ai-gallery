import { Collection, Image, User } from "@prisma/client";

export type SafeImage = Omit<Image, "createdAt"> & {
  createdAt: string;
};

export type SafeCollection = Omit<Collection, "createdAt"> & {
  createdAt: string;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
