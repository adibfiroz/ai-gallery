import { getCollection } from '@/app/actions/collection'
import { getCurrentUser } from '@/app/actions/getCurrentUser'
import CollectionClient from '@/components/collections/collection-client'
import { TAKE } from '@/constants'
import prismadb from '@/lib/prismadb'
import { checkSubscription } from '@/lib/subscription'
import React from 'react'

const SingleCollectionPage = async ({
    params
}: {
    params: { collectionId: string }
}) => {
    const currentUser = await getCurrentUser()
    const isSubscribed = await checkSubscription();

    const { collectionId } = params

    const take = TAKE; // Initial limit
    const skip = 0;  // Skip no records initially

    const [data, count] = await prismadb.$transaction([
        prismadb.collection.findUnique({
            where: {
                id: collectionId,
                userId: currentUser?.id
            },
            include: {
                images: {
                    take,
                    skip,
                    orderBy: {
                        createdAt: "desc"
                    },
                },

            },
        }),
        prismadb.collection.findUnique({
            where: {
                id: collectionId,
                userId: currentUser?.id
            },
            include: {
                images: {
                    orderBy: {
                        createdAt: "desc"
                    },
                }

            },
        }),
    ]);

    const initialData = data && data?.images || []
    const moreData = count && count?.images || []

    return (
        <div>
            <CollectionClient
                collectionId={collectionId}
                cName={data?.name}
                isSubscribed={isSubscribed}
                currentUser={currentUser}
                data={initialData}
                totalCount={moreData}
                initialTake={take}
            />
        </div>
    )
}

export default SingleCollectionPage