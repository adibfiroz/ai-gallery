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

    const collectionData = await prismadb.collection.findUnique({
        where: {
            id: collectionId,
            userId: currentUser?.id,
        },
        include: {
            images: {
                take,
                skip,
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    const imageCount = await prismadb.image.count({
        where: {
            collectionIds: {
                has: collectionId, // Check if the image's collectionIds array contains the collectionId
            },
            collections: {
                some: {
                    userId: currentUser?.id, // Ensure at least one collection associated to the image is from the current user.
                },
            },
        },
    });

    const safeData = collectionData?.images.map((image) => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
    }));

    return (
        <div>
            <CollectionClient
                collectionId={collectionId}
                cName={collectionData?.name}
                isSubscribed={isSubscribed}
                currentUser={currentUser}
                data={safeData ?? []}
                totalCount={imageCount}
                initialTake={take}
            />
        </div>
    )
}

export default SingleCollectionPage