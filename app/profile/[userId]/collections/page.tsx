import { getCollection } from '@/app/actions/collection'
import { getCurrentUser } from '@/app/actions/getCurrentUser'
import CollectionCard from '@/components/collections/collection-card'
import NewCollection from '@/components/collections/new-collection'
import { checkSubscription } from '@/lib/subscription'
import React from 'react'

const CollectionPage = async () => {
    const collections = await getCollection()
    const currentUser = await getCurrentUser();
    const isSubscribed = await checkSubscription();

    return (
        <div>
            <div className=' grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-10'>
                {collections?.map((item) => (
                    <CollectionCard
                        key={item.id}
                        data={item}
                        collections={collections}
                        currentUser={currentUser}
                    />
                ))}
            </div>

            {collections?.length === 0 &&
                <div className='mt-10 p-4'>
                    <div className=' max-w-md mx-auto bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-900 via-teal-950 to-gray-900 p-4 rounded-xl'>
                        <div className=' text-teal-400 text-2xl text-center font-bold'>Collections</div>
                        <ul className=' list-disc text-white my-5 space-y-2 pl-5'>
                            <li>Create and manage collections</li>
                            <li>Organise  images</li>
                            <li>Delete, rename collections</li>
                        </ul>
                        <NewCollection isSubscribed={isSubscribed} />
                    </div>
                </div>
            }
        </div>
    )
}

export default CollectionPage