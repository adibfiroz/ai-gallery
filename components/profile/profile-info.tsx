"use client"

import { SafeUser } from '@/app/types'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

interface ProfileInfoProps {
    currentUser?: SafeUser | null
}

const ProfileInfo = ({ currentUser }: ProfileInfoProps) => {
    const pathName = usePathname()
    useEffect(() => {
        document.title = currentUser?.name || "";
    }, [pathName])

    return (
        <div className=' text-center mt-5 mb-8'>
            <img src={currentUser?.image || '/user.png'} alt={currentUser?.name || "user"} width={120} height={120} className='mx-auto rounded-full' />
            <div className='text-4xl sm:text-5xl text-[#384261] font-medium my-5 capitalize'>{currentUser?.name}</div>
        </div>
    )
}

export default ProfileInfo