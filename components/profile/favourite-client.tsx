"use client"

import { SafeImage, SafeUser } from '@/app/types'
import React, { useEffect, useState } from 'react'
import ImageCard from '../images/image-card'
import { getMoreFavoriteImages } from '@/app/actions/get-more-data'
import { Button } from 'antd'
import { SyncLoader } from 'react-spinners'
import { useAppDispatch } from '@/hooks/store'
import { setTotalImages } from '@/store/slices/modalImagesSlice'
import { TAKE } from '@/constants'

interface FavouriteClientProps {
    data: SafeImage[] | any
    currentUser?: SafeUser | null
    initialTake: number
    isSubscribed: boolean
}

const FavouriteClient = ({
    data,
    currentUser,
    initialTake,
    isSubscribed,
}: FavouriteClientProps) => {
    const [images, setImages] = useState<SafeImage[]>(data);
    const [page, setPage] = useState(2);
    const [hasMoreImage, setHasMoreImage] = useState<any>(data.length < TAKE ? false : true)
    const [loadingMore, setLoadingMore] = useState(false)
    const dispatch = useAppDispatch();

    const handleLoadMore = async () => {
        if (!hasMoreImage) {
            return
        }
        setLoadingMore(true)
        try {
            const response = await getMoreFavoriteImages({
                page: page,
            });

            const filteredNewImages: any = response.data?.filter(newImage => {
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


    return (
        <div>
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

export default FavouriteClient