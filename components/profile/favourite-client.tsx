"use client"

import { SafeUser } from '@/app/types'
import { Collection, Image } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import ImageCard from '../images/image-card'
import { getMoreFavoriteImages } from '@/app/actions/get-more-data'

interface FavouriteClientProps {
    data: Image[]
    currentUser?: SafeUser | null
    collections?: Collection[] | null
    initialTake: number
    totalCount: Image[]
    isSubscribed: boolean
    freeCount: number
}

const FavouriteClient = ({
    data,
    currentUser,
    initialTake,
    totalCount,
    isSubscribed,
    freeCount,
    collections
}: FavouriteClientProps) => {
    const [images, setImages] = useState(data);
    const [take, setTake] = useState(initialTake);

    const handleLoadMore = async () => {
        try {
            const response = await getMoreFavoriteImages({
                take: take,
                skip: images.length,
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
        </div>
    )
}

export default FavouriteClient