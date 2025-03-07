"use client"

import React, { useCallback, useEffect, useState } from 'react'
import ImageCard from './image-card'
import { Image } from '@prisma/client'
import { SafeUser } from '@/app/types'
import { getMoreImages } from '@/app/actions/get-more-data'
import { Button } from 'antd'
import { CircleLoader, SyncLoader } from 'react-spinners'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { fetchInitialImages } from '@/store/slices/initialImagesSlice'
import { setTotalImages } from '@/store/slices/totalImagesSlice'
interface ImageCleintProps {
    decodedString?: string
    orientation?: string
    sort?: string
    currentUser?: SafeUser | null
    isSubscribed: boolean
}

const ImageCleint = ({
    orientation,
    isSubscribed,
    currentUser,
    sort,
    decodedString,
}: ImageCleintProps) => {
    const dispatch = useAppDispatch();

    const { data, loading: isInitailLoading } = useAppSelector((state) => state.initialImages);

    const [images, setImages] = useState<Image[]>(data);
    const [page, setPage] = useState(2);
    const [hasMoreImage, setHasMoreImage] = useState<any>(true)
    const [loadingMore, setLoadingMore] = useState(false)

    const options = {
        orientation,
        sort,
        page: 1,
        searchItem: decodedString
    }

    useEffect(() => {
        dispatch(fetchInitialImages(options))
    }, [orientation, sort])

    const capitalizeString = (str: string) => {
        if (!str) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    useEffect(() => {
        if (decodedString && typeof window !== 'undefined') {
            document.title = `${capitalizeString(decodedString)} AI Images, Download Best of ${capitalizeString(decodedString)} Images`;
        }
    })

    const handleLoadMore = async () => {
        setLoadingMore(true)
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
        setHasMoreImage(true)
        setPage(2)
    }, [orientation, sort])


    useEffect(() => {
        dispatch(setTotalImages(images));
    }, [images]);

    return (
        <div>
            {isInitailLoading ?
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
                    {Array.from({ length: 8 }, (_, index) => (
                        <div key={index} className=' aspect-9/16 bg-gray-200 rounded-xl animate-pulse'></div>
                    ))}
                </div>
                :
                <ImageCard
                    isSubscribed={isSubscribed}
                    currentUser={currentUser}
                    totalImages={images}
                    handleLoadMore={handleLoadMore}
                    data={images}
                    hasMoreImage={hasMoreImage}
                />
            }

            {loadingMore &&
                <div className='flex justify-center my-4'>
                    <SyncLoader
                        size={20}
                        color="#b8c4c3"
                    />
                </div>
            }

            {(hasMoreImage && !loadingMore && !isInitailLoading && data.length > 0) &&
                <div className='text-center my-4' onClick={handleLoadMore}>
                    <Button className='text-lg h-auto py-2 px-6'>Load More</Button>
                </div>
            }
        </div>
    )
}

export default ImageCleint