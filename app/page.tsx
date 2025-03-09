import Category from "@/components/category";
import Container from "@/components/Container";
import HomeFilters from "@/components/filters";
import ImageCleint from "@/components/images/image-cleint";
import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./actions/getCurrentUser";
import { checkSubscription } from "@/lib/subscription";
import { TAKE } from "@/constants";
import HeaderBanner from "@/components/header-banner";

const category = [
  'nature', 'animals', 'sci-fi', 'anime', 'cinematic',
  'food', 'architecture', 'car', 'photoreal', 'art', "city", "neon",
  "sky", "technology", "people", "snow", "fire", "digital", "space"
];

const Home = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  const isSubscribed = await checkSubscription();

  const { orientation, sort } = searchParams;

  let query: any = {}

  const validOrientations = ['landscape', 'portrait', 'square'] as const;
  if (validOrientations.includes(orientation as any)) {
    query.orientation = orientation as string;
  }

  let orderByQuery: any;

  if (sort === 'newest') {
    orderByQuery = { createdAt: 'desc' };
  } else if (!validOrientations.includes(orientation as any)) {
    orderByQuery = { views: 'desc' };
  }

  const take = TAKE;
  const skip = 0;

  const [data, count] = await prismadb.$transaction([
    prismadb.image.findMany({
      where: query,
      orderBy: orderByQuery,
      take: take,
      skip: skip
    }),
    prismadb.image.count({ where: query, orderBy: orderByQuery }),
  ]);

  const safeData = data.map((image) => ({
    ...image,
    createdAt: image.createdAt.toISOString(),
  }));

  return (
    <Container>
      <HeaderBanner />
      <Category category={category} />
      <HomeFilters
        initialOrientation={orientation}
        initialSort={sort}
      />
      <ImageCleint
        isSubscribed={isSubscribed}
        currentUser={currentUser}
        data={safeData}
        initialTake={take}
        orientation={orientation}
        sort={sort}
      />
    </Container>
  );
}

export default Home;
