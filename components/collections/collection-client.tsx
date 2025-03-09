"use client"

import { SafeImage, SafeUser } from '@/app/types'
import React, { useEffect, useState } from 'react'
import ImageCard from '../images/image-card'
import { moreCollectionImages } from '@/app/actions/get-more-data'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from 'antd'
import { SyncLoader } from 'react-spinners'
import { useAppDispatch } from '@/hooks/store'
import { setTotalImages } from '@/store/slices/modalImagesSlice'


interface CollectionClientProps {
    data: SafeImage[]
    collectionId: string
    cName?: string
    totalCount: number
    currentUser?: SafeUser | null
    isSubscribed: boolean
}

const CollectionClient = ({
    data, isSubscribed, cName, collectionId, currentUser, totalCount
}: CollectionClientProps) => {

    const [images, setImages] = useState<SafeImage[]>(data);
    const [page, setPage] = useState(2);
    const [hasMoreImage, setHasMoreImage] = useState<any>(true)
    const [loadingMore, setLoadingMore] = useState(false)

    const dispatch = useAppDispatch();

    const handleLoadMore = async () => {
        setLoadingMore(true)
        try {
            const response = await moreCollectionImages({
                page: page,
                collectionId: collectionId
            });

            const filteredNewImages: any = response.moreData?.filter(newImage => {
                return !images.some(existingImage => existingImage.id === newImage.id);
            });

            setImages((prev) => [...prev, ...filteredNewImages]);
            setHasMoreImage(response?.hasMore)
            setPage((prev) => prev + 1)
            setLoadingMore(false)
        } catch (error) {
            setLoadingMore(false)
            console.error('Failed to load more images:', error);
        } finally {
            setLoadingMore(false)
        }
    };

    useEffect(() => {
        setImages(data)
    }, [data])

    useEffect(() => {
        dispatch(setTotalImages(images));
    }, [images]);


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
                    {totalCount} /
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

            {loadingMore &&
                <div className='flex justify-center my-4'>
                    <SyncLoader
                        size={20}
                        color="#b8c4c3"
                    />
                </div>
            }

            {(hasMoreImage && !loadingMore) &&
                <div className='text-center my-4' onClick={handleLoadMore}>
                    <Button className='text-lg h-auto py-2 px-6'>Load More</Button>
                </div>
            }
        </div>
    )
}

export default CollectionClient