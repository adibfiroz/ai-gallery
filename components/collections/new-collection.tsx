"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { SquarePlus, Zap } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createCollection } from '@/app/actions/collection'
import { SafeCollection, SafeUser } from '@/app/types'
import { Collection } from '@prisma/client'
import Link from 'next/link'
import { MAX_FREE_COLLECTION_LIMIT } from '@/constants'


interface NewCollectionProps {
    currentUser?: SafeUser | null
    collections?: SafeCollection[] | null
    isSubscribed: boolean
}

const NewCollection = ({
    currentUser, isSubscribed, collections
}: NewCollectionProps) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("New Collection");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()


    const handleCollection = () => {
        if (collections) {
            if (!isSubscribed && collections.length >= 5) {
                return
            }
        }
        setOpen(!open)
    }


    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = evt.target.value;
        const maxValueLength = 50; // Maximum number of digits allowed

        // Check if the length of the input value exceeds the maximum value length
        if (inputValue.length > maxValueLength) {
            // If it exceeds, truncate the input value to the maximum length
            evt.target.value = inputValue.slice(0, maxValueLength);
        }
        setName(evt.target.value);
    };

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createCollection({ name: name })
            setIsLoading(false)
            toast.success("Collection created")
            setName("New Collection")
            handleCollection()
            router.replace(`/profile/${formattedName}/collections`)
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong!");
            setIsLoading(false)
        }
    }

    const checkCollection = collections && collections?.length >= MAX_FREE_COLLECTION_LIMIT ? true : false

    return (
        <div>
            <div className=' relative'>
                {!isSubscribed && checkCollection ?
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className=' whitespace-nowrap bg-transparent bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 w-full h-12 rounded-full flex items-center px-4 text-sm text-white font-medium opacity-50'>
                                    <Zap className='mr-2 fill-white text-white' />
                                    New Collection
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className='w-28 '>
                                <Link href="/pricing" className='gap-1 flex justify-between items-center text-[16px] cursor-pointer'>
                                    Upgrade
                                    <Zap size={20} className='mr-2 flex-shrink-0 fill-teal-500 text-teal-500' />
                                </Link>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    :
                    <Button onClick={handleCollection} className=' bg-transparent bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 w-full font-medium h-12 rounded-full'>
                        <SquarePlus className='mr-2' />
                        New Collection
                    </Button>
                }
            </div>

            <Dialog open={open} onOpenChange={handleCollection}>
                <DialogContent className={cn(' w-[90%] sm:w-full !rounded-xl max-w-xl border-0')}>
                    <DialogTitle className=' text-2xl text-[#384261] text-center'>New Collection</DialogTitle>

                    <form action="" onSubmit={handleSubmit}>
                        <div className={cn(' max-w-md mx-auto')}>
                            <div className='w-full text-blue-gray-300 text-md '>Collection name</div>
                            <div className='mt-1'>
                                <input
                                    id='name'
                                    value={name}
                                    required
                                    onChange={handleChange}
                                    className='border-2 transition-all duration-300 border-blue-gray-800 w-full px-4 py-3 text-black bg-transparent rounded-lg outline-none focus:border-2 focus:border-teal-400'
                                    placeholder='name to your collection'
                                    type="text" />
                            </div>

                            <div className='flex justify-between gap-3 mt-10 mb-5'>
                                <Button onClick={handleCollection} type='button' className='w-full h-12' variant="outline">
                                    Cancel
                                </Button>
                                <Button type='submit' disabled={isLoading || name.length === 0 ? true : false} className='w-full h-12'>
                                    {isLoading ?
                                        <img src="/btn-loading.gif" width={20} height={20} alt="loader" />
                                        :
                                        "Create"
                                    }
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewCollection