"use client"

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowRight, Check, Download, Link2, Play, SquareArrowOutUpRight, X } from 'lucide-react';
import { Button } from '../ui/button';
var FileSaver = require('file-saver');
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { cn } from '@/lib/utils';
import { Collection, Image, Orients } from '@prisma/client';
import { SafeUser } from '@/app/types';
import HeartButton from '../HeartButton';
import { increamentDownloads, increamentViewsCount } from '@/app/actions/image';
import { useLoginModal } from '@/hooks/user-login-modal';
import toast from 'react-hot-toast';
import { increaseFreeDownloadLimit } from '@/lib/api-limit';
import { useRouter } from 'next/navigation';
import CollectionButton from '../collection-button';
import Link from 'next/link';


interface ImageModalProps {
    open: boolean;
    data?: Image | undefined;
    totalImages: Image[]
    collections?: Collection[] | null
    handleImageModal: () => void
    currentUser?: SafeUser | null
    isSubscribed: boolean
    freeCount: number
}

const ImageModal = ({
    open,
    data,
    totalImages,
    handleImageModal,
    currentUser,
    isSubscribed,
    freeCount,
    collections
}: ImageModalProps) => {
    const [open2, setOpen2] = useState(false)
    const [copyLink, setCopyLink] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(totalImages.findIndex(img => img.id === data?.id));
    const loginModal = useLoginModal()
    const router = useRouter()

    const handleCollectionModal = () => {
        setOpen2(!open2)
    }

    const handleDownload = async () => {
        if (!currentUser) {
            loginModal.onOpen();
            return
        }

        try {
            if (!isSubscribed) {
                if (freeCount >= 5) {
                    toast.error("Subscribe for unlimited downloads")
                    return
                }
                await increaseFreeDownloadLimit()
                router.refresh();
            }
            FileSaver.saveAs(currentImage?.img, `${currentImage?.caption}.png`);
            await increamentDownloads({ imageId: currentImage?.id })
        } catch (error) {
            toast.error("something went wrong!")
        }
    }

    const onCopyLink = () => {
        setCopyLink(true);
        setTimeout(() => setCopyLink(false), 3000);
    };

    const currentImage = totalImages[currentIndex];

    const left = async () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            await increamentViewsCount({ imageId: currentImage?.id })
        }
    };

    const right = async () => {
        if (currentIndex < totalImages.length - 1) {
            setCurrentIndex(currentIndex + 1);
            await increamentViewsCount({ imageId: currentImage?.id })
        }
    };

    useEffect(() => {
        // Update currentIndex whenever a new item is selected
        if (data) {
            const newIndex = totalImages.findIndex((img) => img.id === data.id);
            setCurrentIndex(newIndex);
        }
    }, [data, totalImages]);

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    return (
        <Dialog open={open} onOpenChange={handleImageModal}>
            <DialogContent className='p-0 md:w-[90%] h-full md:h-auto border-0  outline-none md:rounded-lg  max-w-5xl'>
                <DialogTitle className=' hidden'></DialogTitle>
                <div className=' relative h-full md:max-h-[90vh] overflow-y-auto grid lg:grid-cols-3 scrollModal'>
                    <div className='p-4 lg:col-span-2'>
                        <img src={currentImage?.img} className='max-h-[80vh] lg:sticky lg:top-4 rounded-xl mx-auto' alt="" />
                    </div>
                    <div className=' h-full flex flex-col gap-y-5 justify-between'>
                        <div className='p-4'>
                            <div>Captions:</div>
                            <div className='bg-stone-600/5 w-full text-sm rounded-xl p-3 mt-2'>
                                {currentImage?.caption}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="">
                                    <div className=" text-sm text-left font-semibold text-[#69676e]">Views</div>
                                    <div className=" text-sm text-left leading-6 mt-1">{currentImage?.views}</div>
                                </div>

                                <div className="">
                                    <div className=" text-sm text-left font-semibold text-[#69676e]">orientation</div>
                                    <div className=" text-sm text-left leading-6 mt-1">{currentImage?.orientation}</div>
                                </div>

                                <div className=" text-left">
                                    <div className=" text-sm text-left font-semibold text-[#69676e]">Likes</div>
                                    <div className='flex items-center'>
                                        <HeartButton
                                            imageId={currentImage?.id}
                                            currentUser={currentUser}
                                        />

                                        {currentImage?.userlikeIds.length}
                                    </div>
                                </div>

                                <div className=" text-left">
                                    <div className=" text-sm text-left font-semibold text-[#69676e]">Downloads</div>
                                    <div className="flex gap-2 items-center text-sm text-left leading-6 mt-1">
                                        <Download size={22} className={cn("text-blue-700")} />
                                        {currentImage?.downloads}
                                    </div>
                                </div>
                            </div>

                            {currentUser &&
                                <Button onClick={handleCollectionModal} className='h-12 mt-5'>
                                    Add to collection
                                </Button>
                            }
                        </div>

                        <div className='flex justify-between items-center px-4 pb-4'>
                            {currentImage?.img &&
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='bg-[#384261] text-white px-4 py-3 text-sm flex rounded-md gap-x-2'>
                                        {copyLink ?
                                            <Check size={18} />
                                            :
                                            <SquareArrowOutUpRight size={18} />
                                        }
                                        Share
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='start'>
                                        <CopyToClipboard text={currentImage?.img} onCopy={onCopyLink}>
                                            <DropdownMenuItem className=' justify-between'>
                                                <Link2 size={18} />
                                                copy link
                                            </DropdownMenuItem>
                                        </CopyToClipboard>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            }
                            <Button onClick={handleDownload} className='bg-gradient-to-r from-teal-400 via-teal-500 h-10 gap-x-2 rounded-full to-teal-600'>
                                <Download size={20} />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
                <div onClick={handleImageModal} className='bg-[#384261] cursor-pointer rounded-full shadow-2xl absolute right-4 top-2'>
                    <X className='text-white m-1' size={20} />
                </div>

                {(data && currentIndex > 0) &&
                    <button onClick={left} className=" p-2 group/item cursor-pointer fixed top-[45%] left-4 md:-left-10 text-white z-50 bg-black border border-gray-500 rounded-full ">
                        <Play size={18} className='fill-white transition-all duration-200 rotate-180 group-hover/item:text-[#00ffdf] group-hover/item:fill-[#00ffdf]' />
                    </button>
                }
                {(data && currentIndex < totalImages.length - 1) &&
                    <button onClick={right} className="p-2 group/item cursor-pointer text-white fixed top-[45%] right-4 md:-right-10 z-50 bg-black rounded-full border border-gray-500">
                        <Play size={18} className='fill-white transition-all duration-200 group-hover/item:text-[#00ffdf] group-hover/item:fill-[#00ffdf] ' />
                    </button>
                }

                {currentUser &&
                    <Dialog open={open2} onOpenChange={handleCollectionModal}>
                        <DialogContent className=' w-[90%] sm:w-full max-w-xl rounded-xl border-0'>
                            <div className='flex justify-between'>
                                <DialogTitle className='text-2xl text-[#384261] text-center'>Save to Collection</DialogTitle>
                                <X className=' cursor-pointer' onClick={handleCollectionModal} size={26} />
                            </div>
                            <div className='max-h-[50vh] scrollModal overflow-y-auto space-y-3 pr-1'>
                                {collections?.map((item) => (
                                    <div key={item.id} className=' rounded-md flex items-center justify-between bg-gray-800/15 pr-2 gap-x-4'>
                                        <div className=' truncate px-4 py-3'>{item.name}</div>
                                        <CollectionButton
                                            currentUser={currentUser}
                                            imageId={currentImage?.id}
                                            collection={item}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className='mt-2'>
                                <Link className='flex items-center gap-2 bg-black text-white rounded-md py-4 px-6 hover:opacity-85 w-fit mx-auto' href={`/profile/${formattedName}/collections`}>
                                    Collections
                                    <ArrowRight />
                                </Link>
                            </div>
                        </DialogContent>
                    </Dialog>
                }
            </DialogContent>
        </Dialog>
    )
}

export default ImageModal