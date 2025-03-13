"use client"

import { SafeUser } from '@/app/types'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { fetchCollections } from '@/store/slices/collectionSlice'
import { Bookmark, Download, Heart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

interface ProfileInfoProps {
    currentUser?: SafeUser | null
}

const ProfileInfo = ({ currentUser }: ProfileInfoProps) => {
    const pathName = usePathname()
    const dispatch = useAppDispatch();

    const { data: collections } = useAppSelector((state) => state.collection);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchCollections());
        }
    }, [currentUser]);

    useEffect(() => {
        document.title = currentUser?.name || "";
    }, [pathName])

    return (
        <div className=' text-center mt-5 mb-8'>
            <img src={currentUser?.image || '/user.png'} alt={currentUser?.name || "user"} width={120} height={120} className='mx-auto rounded-full' />
            <div className='text-4xl sm:text-5xl text-[#384261] font-medium my-5 capitalize'>{currentUser?.name}</div>

            <div className='flex justify-center'>
                <div className='grid grid-cols-3'>
                    <div className='px-8 py-2'>
                        <Download className='text-stone-500' />
                        <div className='mt-2 text-lg'>{currentUser?.downloads}</div>
                    </div>
                    <div className='px-8 py-2 border-x border-x-stone-300'>
                        <Heart className='text-stone-500' />
                        <div className='mt-2 text-lg'>{currentUser?.favoriteIds.length}</div>
                    </div>
                    <div className='px-8 py-2'>
                        <Bookmark className='text-stone-500' />
                        <div className='mt-2 text-lg'>{collections.length}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileInfo