import Category from "@/components/category";
import Container from "@/components/Container";
import HomeFilters from "@/components/filters";
import ImageCleint from "@/components/images/image-cleint";
import { getCurrentUser } from "./actions/getCurrentUser";
import { checkSubscription } from "@/lib/subscription";
import HeaderBanner from "@/components/header-banner";
import Link from "next/link";

const category = [
  'nature', 'animals', 'sci-fi', 'anime', 'cinematic',
  'food', 'architecture', 'car', 'photoreal', "city", "neon",
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
        orientation={orientation}
        sort={sort}
      />
    </Container>
  );
}

export default Home;
