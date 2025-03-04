"use client"

import React, { useEffect, useState } from 'react'
import ImageCard from './image-card'
import { Image } from '@prisma/client'
import { SafeUser } from '@/app/types'
import { getMoreImages } from '@/app/actions/get-more-data'
import { Button } from 'antd'
import { SyncLoader } from 'react-spinners'

interface ImageCleintProps {
    data: Image[]
    decodedString?: string
    orientation?: string
    sort?: string
    initialTake: number
    currentUser?: SafeUser | null
    isSubscribed: boolean
}


const ImageCleint = ({ data, orientation, isSubscribed, currentUser, sort, decodedString, initialTake }: ImageCleintProps) => {
    const [images, setImages] = useState<Image[]>([]);
    const [page, setPage] = useState(2);
    const [hasMoreImage, setHasMoreImage] = useState<any>(true)
    const [loading, setLoading] = useState(false)

    const handleLoadMore = async () => {
        setLoading(true)
        try {
            const response = await getMoreImages({
                orientation: orientation,
                sort: sort,
                page: page,
                searchItem: decodedString
            });

            const filteredNewImages = response.data?.filter(newImage => {
                return !images?.some(existingImage => existingImage?.id === newImage.id);
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


    useEffect(() => {
        setHasMoreImage(true)
        setPage(2)
    }, [orientation, sort])

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

export default ImageCleint