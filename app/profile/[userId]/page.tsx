import { getCollection } from '@/app/actions/collection';
import getCurrentUser from '@/app/actions/getCurrentUser';
import FavouriteClient from '@/components/profile/favourite-client';
import { TAKE } from '@/constants';
import { getFreeDownloadCount } from '@/lib/api-limit';
import prismadb from '@/lib/prismadb';
import { checkSubscription } from '@/lib/subscription';
import React from 'react'

const ProfilePage = async () => {
    const currentUser = await getCurrentUser();
    const isSubscribed = await checkSubscription();
    const freeCount = await getFreeDownloadCount()
    const collections = await getCollection()


    const take = TAKE; // Initial limit
    const skip = 0;  // Skip no records initially

    const [data, count] = await prismadb.$transaction([
        prismadb.image.findMany({
            where: {
                id: {
                    in: [...(currentUser?.favoriteIds || [])]
                }
            },
            take: take,
            skip: skip,
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prismadb.image.count({
            where: {
                id: {
                    in: [...(currentUser?.favoriteIds || [])]
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
    ]);

    return (
        <div className='mt-8'>
            <FavouriteClient
                data={data}
                initialTake={take}
                freeCount={freeCount}
                collections={collections}
                currentUser={currentUser}
                isSubscribed={isSubscribed}
            />
        </div>
    )
}

export default ProfilePage