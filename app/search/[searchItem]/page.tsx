import { getCurrentUser } from '@/app/actions/getCurrentUser'
import Category from '@/components/category'
import Container from '@/components/Container'
import ImageCleint from '@/components/images/image-cleint'
import SearchFilters from '@/components/search-Filters'
import { TAKE } from '@/constants'
import prismadb from '@/lib/prismadb'
import { checkSubscription } from '@/lib/subscription'
import React from 'react'

const SearchPage = async ({
    searchParams,
    params
}: {
    searchParams: { [key: string]: string | undefined };
    params: { searchItem: string }
}) => {
    const currentUser = await getCurrentUser();
    const isSubscribed = await checkSubscription();

    const { orientation, sort } = searchParams;
    const { searchItem } = params
    const decodedString = decodeURIComponent(searchItem);

    let query: any = {}

    const validOrientations = ['landscape', 'portrait', 'square'] as const;
    if (validOrientations.includes(orientation as any)) {
        query.orientation = orientation as string;
    }

    if (decodedString) {
        query = {
            ...query,
            OR: [
                { caption: { contains: decodedString, mode: 'insensitive' } },
                { tags: { hasSome: decodedString.split(',') } },
            ],
        };
    }

    if (sort === 'featured' && isSubscribed) {
        query.Pro = true;
    }

    let orderByClause: any;
    if (sort === 'newest') {
        orderByClause = { createdAt: 'desc' };
    } else if (!validOrientations.includes(orientation as any)) {
        // If orientation is invalid, undefined, or null, sort by views: 'desc'
        orderByClause = { views: 'desc' };
    }

    const take = TAKE;
    const skip = 0;

    const [data, count] = await prismadb.$transaction([
        prismadb.image.findMany({
            where: query,
            orderBy: orderByClause,
            take: take,
            skip: skip
        }),
        prismadb.image.count({ where: query, orderBy: orderByClause }),
    ]);

    const tag = await prismadb.tags.findUnique({
        where: { name: searchItem },
        select: { relatedTags: true },
    });


    const safeData = data.map((image) => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
    }));


    return (
        <Container>
            <Category category={tag?.relatedTags} />
            <SearchFilters
                initialOrientation={orientation}
                initialSort={sort}
                count={count}
                isSubscribed={isSubscribed}
            />
            <ImageCleint
                data={safeData}
                sort={sort}
                initialTake={take}
                orientation={orientation}
                currentUser={currentUser}
                isSubscribed={isSubscribed}
                decodedString={decodedString}
            />
        </Container>
    )
}

export default SearchPage