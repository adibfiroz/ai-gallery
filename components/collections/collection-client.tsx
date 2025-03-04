"use client"

import { SafeUser } from '@/app/types'
import { Collection, Image } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import ImageCard from '../images/image-card'
import { moreCollectionImages } from '@/app/actions/get-more-data'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from 'antd'
import { SyncLoader } from 'react-spinners'


interface CollectionClientProps {
    data: Image[]
    initialTake: number
    collectionId: string
    cName?: string
    totalCount: Image[]
    currentUser?: SafeUser | null
    isSubscribed: boolean
}

const CollectionClient = ({
    data, isSubscribed, cName, collectionId, currentUser, totalCount, initialTake
}: CollectionClientProps) => {

    const [images, setImages] = useState(data);
    const [page, setPage] = useState(2);
    const [hasMoreImage, setHasMoreImage] = useState<any>(true)
    const [loading, setLoading] = useState(false)

    const handleLoadMore = async () => {
        setLoading(true)
        try {
            const response = await moreCollectionImages({
                page: page,
                collectionId: collectionId
            });

            const filteredNewImages = response.moreData?.filter(newImage => {
                return !images.some(existingImage => existingImage.id === newImage.id);
            });

            setImages((prev) => [...prev, ...filteredNewImages]);
            setHasMoreImage(response?.hasMore)
            setPage((prev) => prev + 1)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Failed to load more images:', error);
        } finally {
            setLoading(false)
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
                isSubscribed={isSubscribed}
                currentUser={currentUser}
                totalImages={images}
                handleLoadMore={handleLoadMore}
                data={images}
                hasMoreImage={hasMoreImage}
            />

            {loading &&
                <div className='flex justify-center my-4'>
                    <SyncLoader
                        size={20}
                        color="#b8c4c3"
                    />
                </div>
            }

            {(hasMoreImage && !loading) &&
                <div className='text-center my-4' onClick={handleLoadMore}>
                    <Button className='text-lg h-auto py-2 px-6'>Load More</Button>
                </div>
            }
        </div>
    )
}

export default CollectionClient