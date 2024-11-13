import Category from "@/components/category";
import Container from "@/components/Container";
import HomeFilters from "@/components/filters";
import ImageCleint from "@/components/images/image-cleint";
import prismadb from "@/lib/prismadb";
import getCurrentUser from "./actions/getCurrentUser";
import { checkSubscription } from "@/lib/subscription";
import { getFreeDownloadCount } from "@/lib/api-limit";
import { subscribe } from "diagnostics_channel";
import { getCollection } from "./actions/collection";
import { TAKE } from "@/constants";

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
  const freeCount = await getFreeDownloadCount()
  const collections = await getCollection()

  const { orientation, sort } = searchParams;

  let query: any = {}

  if (query) {
    query.orientation = orientation
  };

  let orderByQuery: any = sort === 'newest'
    ? { createdAt: 'desc' }
    : sort === undefined &&
    { views: 'desc' }

  const take = TAKE; // Initial limit
  const skip = 0;  // Skip no records initially

  const [data, count] = await prismadb.$transaction([
    prismadb.image.findMany({
      where: query,
      orderBy: orderByQuery,
      take: take,
      skip: skip
    }),
    prismadb.image.count({ where: query, orderBy: orderByQuery }),
  ]);

  return (
    <Container>
      <div className="rounded-2xl p-4 h-52 bg-no-repeat bg-cover bg-bottom bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('/backBanner.jpg')]">
        <div className="flex justify-center items-center leading-[55px] text-white h-full text-5xl font-extrabold">
          <div>Only the best <span className=' font-extrabold text-teal-500'> AI </span> images</div>
        </div>
      </div>

      <Category category={category} />
      <HomeFilters />
      <ImageCleint
        collections={collections}
        freeCount={freeCount}
        isSubscribed={isSubscribed}
        currentUser={currentUser}
        data={data}
        initialTake={take}
        orientation={orientation}
        sort={sort}
      />
    </Container>
  );
}

export default Home;
