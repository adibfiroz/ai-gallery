"use client"

import { SafeUser } from '@/app/types'
import { Collection, Image } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import ImageCard from '../images/image-card'
import { moreCollectionImages } from '@/app/actions/get-more-data'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'


interface CollectionClientProps {
    data: Image[]
    collections: Collection[] | null
    initialTake: number
    collectionId: string
    cName?: string
    totalCount: Image[]
    currentUser?: SafeUser | null
    isSubscribed: boolean
    freeCount: number
}

const CollectionClient = ({
    data, collections, isSubscribed, freeCount, cName, collectionId, currentUser, totalCount, initialTake
}: CollectionClientProps) => {

    const [images, setImages] = useState(data);
    const [take, setTake] = useState(initialTake);

    const handleLoadMore = async () => {
        try {
            const response = await moreCollectionImages({
                take: take,
                skip: images.length,
                collectionId: collectionId
            });

            const filteredNewImages = response.filter(newImage => {
                return !images.some(existingImage => existingImage.id === newImage.id);
            });

            setImages((prev) => [...prev, ...filteredNewImages]);

        } catch (error) {
            console.error('Failed to load more images:', error);
        } finally {
        }
    };

    useEffect(() => {
        setImages(data)
    }, [data])

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    return (
        <div>
            <div className='flex justify-between my-5 gap-x-5 profile-scroll overflow-x-auto'>
                <div className='flex gap-x-2 items-center'>
                    <Link href={`/profile/${formattedName}/collections`} className={(' text-gray-500 hover:underline')}>Collections</Link>
                    <ChevronRight className='' size={18} />
                    <div className=' whitespace-nowrap'>{cName}</div>
                </div>
                <div className='whitespace-nowrap'>
                    {totalCount.length} /
                    images
                </div>
            </div>
            <ImageCard
                collections={collections}
                freeCount={freeCount}
                isSubscribed={isSubscribed}
                currentUser={currentUser}
                totalImages={data}
                handleLoadMore={handleLoadMore}
                data={images}
            />
        </div>
    )
}

export default CollectionClient