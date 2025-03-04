import { getCollection } from '@/app/actions/collection';
import { getCurrentUser } from '@/app/actions/getCurrentUser';
import FavouriteClient from '@/components/profile/favourite-client';
import { TAKE } from '@/constants';
import prismadb from '@/lib/prismadb';
import { checkSubscription } from '@/lib/subscription';
import React from 'react'

const ProfilePage = async () => {
    const currentUser = await getCurrentUser();
    const isSubscribed = await checkSubscription();


    const take = TAKE;
    const skip = 0;

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
                currentUser={currentUser}
                isSubscribed={isSubscribed}
            />
        </div>
    )
}

export default ProfilePage