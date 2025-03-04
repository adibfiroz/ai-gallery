
"use client"

import { FolderPen, FolderPlus, FolderX, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Collection, Image } from '@prisma/client'
import moment from 'moment'
import { cn } from '@/lib/utils'
import { SafeCollection, SafeUser } from '@/app/types'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { deleteCollection, updateCollection } from '@/app/actions/collection'
import { getCollectionCardImages, moreCollectionImages } from '@/app/actions/get-more-data'
import { Image as AntImage } from 'antd';

interface CollectionCardProps {
    data: SafeCollection
    collections: SafeCollection[]
    currentUser?: SafeUser | null
}

const CollectionCard = ({ data, currentUser, collections }: CollectionCardProps) => {
    const [getImages, setGeImages] = useState<Image[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [name, setName] = useState(data.name);
    const router = useRouter()

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading2(true)
            const res = await getCollectionCardImages({ collectionId: data.id });
            setGeImages(res);
            setIsLoading2(false)
        };
        fetchData();
    }, [data.id]);


    const firstImg = getImages[0]?.img

    const secondImg = getImages[1]?.img


    const handleDeleteModal = () => {
        setOpen(!open)
    }

    const handleUpdateModal = () => {
        setName(data.name)
        setOpen2(!open2)
    }

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await deleteCollection({
                collectionId: data.id,
            })
            handleDeleteModal()
            router.refresh()
            setIsLoading(false)
            setOpen(false)
        } catch (error) {
            setIsLoading(false)
            handleDeleteModal()
            toast.error("Something went wrongs");
        }
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (data.name === name) {
            handleUpdateModal()
            return
        }
        const colectionExists = collections?.some((element: any) => element.name.toLowerCase() === name.toLowerCase());
        if (colectionExists) {
            toast.error(`Collection Already exist!`);
            return
        }
        setIsLoading3(false)
        try {
            await updateCollection({ collectionId: data.id, name: name })
            router.refresh()
            handleUpdateModal()
            setIsLoading3(false)
        } catch (error) {
            setIsLoading3(false)
            handleUpdateModal()
            toast.error("Something went wrongs");
        }
    }

    return (
        <div className='rounded-xl bg-gray-800/5 transition-all duration-200 shadow-md overflow-hidden group/item'>
            <Link href={`/profile/${formattedName}/collections/${data.id}`}>
                {isLoading2 ?
                    <div className='aspect-square grid grid-cols-1'>
                        <div className='flex justify-center items-center'>
                            <FolderPlus size={120} className='text-[#797b88] animate-pulse' />
                        </div>
                    </div>
                    :
                    <div className={cn(' aspect-square grid grid-cols-1 gap-1 overflow-hidden', getImages.length > 1 && " grid-cols-2")}>
                        {getImages.length > 0 &&
                            <AntImage
                                className='aspect-square !h-full object-cover transition-all duration-200 group-hover/item:scale-105'
                                src={firstImg}
                                fallback='/fallback-image.png'
                                preview={false}
                            />
                        }
                        {getImages.length > 1 &&
                            <AntImage
                                className='aspect-square !h-full object-cover transition-all duration-200 group-hover/item:scale-105'
                                src={secondImg}
                                fallback='/fallback-image.png'
                                preview={false}
                            />
                        }
                        {getImages.length === 0 &&
                            <div className='flex justify-center items-center'>
                                <FolderPlus size={120} className='text-gray-400 transition-all duration-300 group-hover/item:text-gray-500' />
                            </div>
                        }
                    </div>
                }
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger className=' w-full'>
                    <div className='pl-5 pr-3 border-t bg-[#121c38]  border-[#282c42] text-white py-3 gap-3 flex justify-between'>
                        <div className=' truncate'>{data.name}</div>
                        <MoreVertical />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className=" rounded-lg">
                    <DropdownMenuItem onClick={handleUpdateModal} className=" flex gap-10 px-3 py-2.5 justify-between cursor-pointer">
                        Rename
                        <FolderPen size={18} />
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleDeleteModal} className="text-[#ff4d88] flex gap-10 px-3 py-2.5 justify-between cursor-pointer">
                        Delete
                        <FolderX size={18} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className=' text-[12px] text-blue-gray-500 pl-3'>{moment(data.createdAt).fromNow()}</div>
                </DropdownMenuContent>
            </DropdownMenu>


            <Dialog open={open2} onOpenChange={handleUpdateModal}>
                <DialogContent className={cn(' w-[90%] sm:w-full !rounded-xl max-w-xl border-0')}>
                    <DialogTitle className=' text-2xl text-[#384261] text-center'>Update Collection</DialogTitle>

                    <form action="" onSubmit={handleSubmit}>
                        <div className={cn(' max-w-md mx-auto')}>
                            <div className='w-full text-blue-gray-300 text-md '>Collection name</div>
                            <div className='mt-1'>
                                <input
                                    id='name'
                                    defaultValue={name}
                                    required
                                    onChange={handleChange}
                                    className='border-2 transition-all duration-300 border-blue-gray-800 w-full px-4 py-3 text-black bg-transparent rounded-lg outline-none focus:border-2 focus:border-teal-400'
                                    placeholder='name to your collection'
                                    type="text" />
                            </div>

                            <div className='flex justify-between gap-3 mt-10 mb-5'>
                                <Button onClick={handleUpdateModal} type='button' className='w-full h-12' variant="outline">
                                    Cancel
                                </Button>
                                <Button type='submit' className='w-full h-12'>
                                    {isLoading3 ?
                                        <img src="/btn-loading.gif" width={25} height={25} alt="loader" />
                                        :
                                        "Update"
                                    }
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={open} onOpenChange={handleDeleteModal}>
                <DialogContent className=' w-[90%] sm:w-full max-w-xl !rounded-xl border-0'>
                    <DialogTitle className='text-2xl text-center'>Are you sure you want to delete this collection?</DialogTitle>
                    <p className=' text-center text-gray-500'>Images in this collection will also be removed</p>

                    <div className='flex justify-center gap-6 mt-3 p-4'>
                        <Button onClick={handleDeleteModal} variant="outline" className='w-20 h-12 text-lg text-[#242c43] font-semibold hover:opacity-60'>No</Button>
                        <Button onClick={handleDelete} className='w-20 h-12 text-lg bg-[#ff4d88] hover:bg-[#ff4d88] hover:opacity-60'>
                            {isLoading ?
                                <img src="/btn-loading.gif" width={25} height={25} alt="loader" />
                                :
                                "Yes"
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CollectionCard