"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils';
import { SafeCollection, SafeUser } from '@/app/types';
import NewCollection from '../collections/new-collection';
import { Collection } from '@prisma/client';

interface ProfileLinksProps {
    currentUser?: SafeUser | null
    collections?: SafeCollection[] | null
    isSubscribed: boolean
}

const ProfileLinks = ({ currentUser, isSubscribed, collections }: ProfileLinksProps) => {
    const pathName = usePathname();
    const router = useRouter();
    const params = useParams()

    const getParams = params?.userId as string

    const routes = [
        {
            label: 'Favourites',
            href: `/profile/${getParams}`,
        },
        {
            label: 'Collections',
            href: `/profile/${getParams}/collections`,
        },
        {
            label: 'Settings',
            href: `/profile/${getParams}/settings`,
            back: 'bg-gray-800/60'
        },
    ]


    return (
        <div>
            <div className='profile-scroll overflow-x-auto flex items-center justify-between gap-x-5'>
                <div className='flex gap-x-2 bg-stone-600/10 rounded-full'>
                    {routes.map((route) => (
                        <Link href={route.href} key={route.label} className={cn('py-3 px-5 text-gray-600 hover:text-black rounded-full font-medium', pathName === route.href && "bg-black text-white hover:text-white")}>{route.label}</Link>
                    ))}
                </div>
                {pathName?.includes("collections") &&
                    <NewCollection
                        currentUser={currentUser}
                        collections={collections}
                        isSubscribed={isSubscribed}
                    />
                }
            </div>
        </div>
    )
}

export default ProfileLinks