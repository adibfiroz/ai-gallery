"use client"

import React, { useEffect, useState } from 'react'
import ImageCard from './image-card'
import { SafeImage, SafeUser } from '@/app/types'
import { getMoreImages } from '@/app/actions/get-more-data'
import { Button } from 'antd'
import { SyncLoader } from 'react-spinners'
import { useAppDispatch } from '@/hooks/store'
import { usePathname } from 'next/navigation'
import { setTotalImages } from '@/store/slices/modalImagesSlice'

interface ImageCleintProps {
    data: SafeImage[]
    decodedString?: string
    orientation?: string
    sort?: string
    initialTake: number
    currentUser?: SafeUser | null
    isSubscribed: boolean
}


const ImageCleint = ({ data, orientation, isSubscribed, currentUser, sort, decodedString, initialTake }: ImageCleintProps) => {
    const [images, setImages] = useState<SafeImage[]>([]);
    const [page, setPage] = useState(2);
    const [hasMoreImage, setHasMoreImage] = useState<any>(true)
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch();
    const pathName = usePathname()


    const handleLoadMore = async () => {
        setLoading(true)
        try {
            const response = await getMoreImages({
                orientation: orientation,
                sort: sort,
                page: page,
                searchItem: decodedString
            });

            const filteredNewImages: any = response.data?.filter(newImage => {
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

            {loading &&
                <div className='flex justify-center my-4'>
                    <SyncLoader
                        size={20}
                        color="#b8c4c3"
                    />
                </div>
            }

            {(hasMoreImage && !loading && data.length > 0) &&
                <div className='text-center my-4' onClick={handleLoadMore}>
                    <Button className='text-lg h-auto py-2 px-6'>Load More</Button>
                </div>
            }
        </div>
    )
}

export default ImageCleint