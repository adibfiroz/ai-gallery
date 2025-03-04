import prismadb from "@/lib/prismadb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const orientation = searchParams.get("orientation") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const searchItem = searchParams.get("searchItem") || undefined;
  const page = searchParams.get("cursor") || 1;
  const LIMIT = 5;

  let query: any = {};

  if (orientation) {
    query.orientation = orientation;
  }

  if (searchItem) {
    query.OR = [
      { caption: { contains: searchItem, mode: "insensitive" } },
      { tags: { hasSome: searchItem.split(",") } },
    ];
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

  const data = await prismadb.image.findMany({
    where: query,
    orderBy: orderByClause,
    take: LIMIT,
    skip: (Number(page) - 1) * LIMIT,
  });

  const totalimages = await prismadb.image.count({ where: query });

  const hasMore = Number(page) * LIMIT < totalimages;

  return Response.json({ data, hasMore });
}
