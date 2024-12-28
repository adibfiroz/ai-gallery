import { getCollection } from '@/app/actions/collection'
import getCurrentUser from '@/app/actions/getCurrentUser'
import Category from '@/components/category'
import Container from '@/components/Container'
import ImageCleint from '@/components/images/image-cleint'
import SearchFilters from '@/components/search-Filters'
import { TAKE } from '@/constants'
import { getFreeDownloadCount } from '@/lib/api-limit'
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
    const freeCount = await getFreeDownloadCount()
    const collections = await getCollection()

    const { orientation, sort } = searchParams;
    const { searchItem } = params
    const decodedString = decodeURIComponent(searchItem);

    let query: any = {}


    if (query) {
        query.orientation = orientation
    };

    if (decodedString) {
        query = {
            ...query,
            OR: [
                { caption: { contains: decodedString, mode: 'insensitive' } },
                { tags: { hasSome: decodedString.split(',') } },
            ],
        };
    }

    if (sort === 'featured') {
        query.Pro = true;
    }

    let orderByClause: any = sort === 'newest'
        ? { createdAt: 'desc' }
        : sort === undefined ?
            { views: 'desc' } : undefined

    const take = TAKE; // Initial limit
    const skip = 0;  // Skip no records initially

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


    return (
        <Container>
            <Category category={tag?.relatedTags} />
            <SearchFilters count={count} isSubscribed={isSubscribed} />
            <ImageCleint
                data={data}
                sort={sort}
                initialTake={take}
                freeCount={freeCount}
                collections={collections}
                orientation={orientation}
                currentUser={currentUser}
                isSubscribed={isSubscribed}
                decodedString={decodedString}
            />
        </Container>
    )
}

export default SearchPage