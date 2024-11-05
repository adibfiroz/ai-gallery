"use client"

import React, { useEffect, useState } from 'react'
import ImageCard from './image-card'
import { Collection, Image } from '@prisma/client'
import { SafeUser } from '@/app/types'
import { getMoreImages } from '@/app/actions/get-more-data'

interface ImageCleintProps {
    data: Image[]
    collections?: Collection[] | null
    decodedString?: string
    orientation?: string
    sort?: string
    initialTake: number
    totalCount: Image[]
    currentUser?: SafeUser | null
    isSubscribed: boolean
    freeCount: number
}


const ImageCleint = ({ data, orientation, collections, isSubscribed, freeCount, currentUser, sort, decodedString, totalCount, initialTake }: ImageCleintProps) => {
    const [images, setImages] = useState(data);
    const [take, setTake] = useState(initialTake);

    const handleLoadMore = async () => {
        try {
            const response = await getMoreImages({
                orientation: orientation,
                sort: sort,
                take: take,
                skip: images.length,
                searchItem: decodedString
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


    return (
        <div>
            <ImageCard
                collections={collections}
                freeCount={freeCount}
                isSubscribed={isSubscribed}
                currentUser={currentUser}
                totalImages={totalCount}
                handleLoadMore={handleLoadMore}
                data={images}
            />

            {/* {images.length !== totalCount &&
                <div className='text-center mt-5'>
                    <button onClick={handleLoadMore} disabled={loading} className="rounded-md p-4 cursor-pointer hover:bg-teal-500/10 hover:text-teal-800 border border-teal-500/80">
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            } */}
        </div>
    )
}

export default ImageCleint