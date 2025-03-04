"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Bookmark, Check, Download, Link2, Play, SquareArrowOutUpRight, X } from 'lucide-react';
import { Button } from '../ui/button';
var FileSaver = require('file-saver');
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { cn } from '@/lib/utils';
import { Collection, Image, Orients } from '@prisma/client';
import { SafeUser } from '@/app/types';
import HeartButton from '../HeartButton';
import { getRelatedImages, increamentDownloads, increamentViewsCount } from '@/app/actions/image';
import { useLoginModal } from '@/hooks/user-login-modal';
import toast from 'react-hot-toast';
import { increaseFreeDownloadLimit } from '@/lib/api-limit';
import { useRouter } from 'next/navigation';
import CollectionButton from '../collection-button';
import Link from 'next/link';
import { MAX_DOWNLOAD_LIMIT } from '@/constants';
import Category from '../category';
import { Image as AntImage, Dropdown, MenuProps, Modal } from 'antd';
import ImageCard from './image-card';
import { fetchFreeDownloadCount } from '@/store/slices/freeDownloadSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { fetchCollections } from '@/store/slices/collectionSlice';
import { fetchSingleImage } from '@/store/slices/imageSlice';

interface ImageModalProps {
    open: boolean;
    data?: Image | undefined;
    totalImages: Image[]
    handleImageModal: () => void
    currentUser?: SafeUser | null
    isSubscribed: boolean
    count: number
}

const ImageModal = ({
    open,
    data,
    totalImages,
    handleImageModal,
    currentUser,
    isSubscribed,
    count,

}: ImageModalProps) => {
    const [open2, setOpen2] = useState(false)
    const [copyLink, setCopyLink] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(totalImages?.findIndex(img => img.id === data?.id));
    const currentImage = totalImages[currentIndex];

    const loginModal = useLoginModal()
    const router = useRouter()
    const dispatch = useAppDispatch();

    const { data: collections } = useAppSelector((state) => state.collection);
    const { data: singleImage, loading } = useAppSelector((state) => state.image);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchCollections());
        }
    }, [dispatch]);

    const hasFavorited = useMemo(() => {
        return collections?.some((collection: Collection) => collection.imageIds.includes(currentImage?.id)) ?? false;
    }, [collections, currentImage?.id]);

    const handleCollectionModal = () => {
        setOpen2(!open2)
    }

    const handleDownload = async () => {
        if (!currentUser) {
            handleImageModal()
            loginModal.onOpen();
            return
        }

        try {
            if (!isSubscribed) {
                if (currentImage?.Pro) {
                    toast.error("subscribe for unlimited downloads")
                    return
                }
                if (count >= MAX_DOWNLOAD_LIMIT) {
                    toast.error("you have reached your \n daily download limit")
                    return
                }
                await increaseFreeDownloadLimit()
                dispatch(fetchFreeDownloadCount())
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

    const left = async () => {
        setCurrentIndex(prevIndex => {
            if (prevIndex > 0) {
                const newIndex = prevIndex - 1;
                dispatch(fetchSingleImage({ imageId: totalImages[newIndex]?.id }));
                return newIndex;
            }
            return prevIndex;
        });
    };

    const right = async () => {
        setCurrentIndex(prevIndex => {
            if (prevIndex < totalImages.length - 1) {
                const newIndex = prevIndex + 1;
                dispatch(fetchSingleImage({ imageId: totalImages[newIndex]?.id }));
                return newIndex;
            }
            return prevIndex;
        });
    };

    useEffect(() => {
        // Update currentIndex whenever a new item is selected
        if (data) {
            const newIndex = totalImages.findIndex((img) => img.id === data.id);
            setCurrentIndex(newIndex);
        }
    }, [data, totalImages]);

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    const items: MenuProps['items'] = [
        {
            label: (
                <CopyToClipboard text={currentImage?.img} onCopy={onCopyLink}>
                    <div className='flex items-center gap-2'>
                        <Link2 size={18} />
                        copy link
                    </div>
                </CopyToClipboard>
            ),
            key: '0',
        },
    ];

    const [relatedImages, setRelatedImages] = useState<Image[] | null>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchRelatedImages = async () => {
        setIsLoading(true)
        try {
            const res = await getRelatedImages({ tags: currentImage.tags })
            setRelatedImages(res)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            toast.error("Error fetching Similar Images")
        }
    }

    useEffect(() => {
        if (currentImage?.tags) {
            fetchRelatedImages()
        }
    }, [currentImage?.tags])


    const handleLoadMore = () => {

    }

    const hasMoreImage = false

    return (
        <Modal
            open={open}
            onCancel={handleImageModal}
            width={1000}
            centered
            destroyOnClose={true}
            cancelButtonProps={{ hidden: true }}
            okButtonProps={{ hidden: true }}
            className=''>
            <div className=' relative h-full'>
                <div className=' grid lg:grid-cols-3'>
                    <div className='p-4 lg:col-span-2 relative text-center prevImage'>
                        <div className='mb-10 lg:mb-0'></div>
                        <AntImage
                            className='max-h-[80vh] rounded-xl'
                            src={currentImage?.img}
                            fallback='/fallback-image.png'
                        />
                    </div>
                    <div className=' h-full flex flex-col gap-y-5 justify-between'>
                        <div className='p-4'>
                            <div>Caption</div>
                            <div className='bg-stone-600/5 w-full text-sm rounded-xl p-3 mt-3'>
                                {currentImage?.caption}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="">
                                    <div className=" text-sm text-left font-semibold text-[#69676e]">Views</div>
                                    <div className=" text-sm text-left leading-6 mt-1">{currentImage?.views}</div>
                                </div>

                                <div className=" text-left">
                                    <div className=" text-sm text-left font-semibold text-[#69676e]">Likes</div>
                                    <div className='flex items-center'>
                                        {currentUser &&
                                            <HeartButton
                                                imageId={currentImage?.id}
                                                currentUser={currentUser}
                                            />
                                        }

                                        {singleImage?.userlikeIds.length || 0}

                                    </div>
                                </div>

                                <div className=" text-left">
                                    <div className=" text-sm text-left font-semibold text-[#69676e]">Downloads</div>
                                    <div className="flex gap-2 items-center text-sm text-left leading-6 mt-1">
                                        <Download size={22} className={cn("text-blue-700")} />
                                        {currentImage?.downloads}
                                    </div>
                                </div>

                                {currentUser &&
                                    <div className="text-left">
                                        <div className=" text-sm text-left font-semibold text-[#69676e]">Collections</div>
                                        <>
                                            {hasFavorited ?
                                                <Button onClick={handleCollectionModal} className='p-0 shadow-none h-auto bg-transparent rounded-full hover:bg-transparent mt-1'>
                                                    <Bookmark size={22} className={cn("fill-blue-700 text-blue-700")} />
                                                </Button>
                                                : <Button onClick={handleCollectionModal} className='p-0 shadow-none h-auto bg-transparent rounded-full hover:bg-transparent mt-1'>
                                                    <Bookmark size={22} className={cn("text-blue-700")} />
                                                </Button>
                                            }
                                        </>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='flex justify-between items-center px-4 pb-4'>
                            {currentImage?.img &&
                                <Dropdown
                                    menu={{ items }}
                                    placement="topLeft"
                                    trigger={['click']}>
                                    <a onClick={(e) => e.preventDefault()} className=' text-white items-center bg-[#384261] px-4 py-2.5 text-sm flex rounded-full gap-x-2'>
                                        {copyLink ?
                                            <Check size={18} />
                                            :
                                            <SquareArrowOutUpRight size={18} />
                                        }
                                        Share
                                    </a>
                                </Dropdown>
                            }
                            <Button onClick={handleDownload} className={cn('bg-gradient-to-r rounded-full transition-all duration-300 from-teal-400 via-teal-500 h-10 gap-x-2  to-teal-600 hover:from-teal-500 hover:via-teal-600 hover:to-teal-700')}>
                                <Download size={20} />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='px-4 relative'>
                    <Category category={currentImage?.tags} />
                </div>

                <div className='px-4 relative'>
                    {isLoading ?
                        <div className='grid grid-cols-4 gap-4 pb-5'>
                            {Array.from({ length: 8 }, (_, index) => (
                                <div key={index} className=' aspect-square rounded-xl bg-gray-200 animate-pulse'></div>
                            ))}
                        </div>
                        : relatedImages &&
                        <ImageCard
                            isSubscribed={isSubscribed}
                            currentUser={currentUser}
                            totalImages={relatedImages}
                            handleLoadMore={handleLoadMore}
                            data={relatedImages}
                            relatedImages={relatedImages}
                            hasMoreImage={hasMoreImage}
                        />}
                </div>

            </div>

            {(data && currentIndex > 0) &&
                <button onClick={left} className=" p-2 group/item cursor-pointer fixed top-[45%] left-5 xl:left-16 text-white z-50 bg-black border border-gray-500 rounded-full ">
                    <Play size={18} className='fill-white transition-all duration-200 rotate-180 group-hover/item:text-[#00ffdf] group-hover/item:fill-[#00ffdf]' />
                </button>
            }
            {(data && currentIndex < totalImages.length - 1) &&
                <button onClick={right} className="p-2 group/item cursor-pointer text-white fixed top-[45%] right-5 xl:right-16 z-50 bg-black rounded-full border border-gray-500">
                    <Play size={18} className='fill-white transition-all duration-200 group-hover/item:text-[#00ffdf] group-hover/item:fill-[#00ffdf] ' />
                </button>
            }

            {currentImage?.Pro && <img src="/crown.png" width={30} height={30} className=' absolute left-4 top-4 z-10' alt="proImage" />}

            {currentUser &&
                <Modal
                    open={open2}
                    onCancel={handleCollectionModal}
                    width={500}
                    centered
                    cancelButtonProps={{ hidden: true }}
                    okButtonProps={{ hidden: true }}
                >
                    <div className='flex justify-between p-4'>
                        <div className='text-2xl text-[#384261] font-semibold text-center'>Save to Collection</div>
                    </div>
                    <div className='max-h-[50vh] bg-gray-100 overflow-y-auto space-y-3 p-4' style={{ scrollbarWidth: "thin" }}>
                        {collections?.map((item: Collection) => (
                            <div key={item.id}>
                                <CollectionButton
                                    currentUser={currentUser}
                                    imageId={currentImage?.id}
                                    collection={item}
                                />
                            </div>
                        ))}
                    </div>

                    <div className='py-4'>
                        <Link className='flex items-center gap-2 bg-black text-white rounded-xl py-4 px-6 hover:opacity-85 w-fit mx-auto text-lg' href={`/profile/${formattedName}/collections`}>
                            Collections
                            <ArrowRight />
                        </Link>
                    </div>
                </Modal>
            }
        </Modal>
    )
}

export default ImageModal