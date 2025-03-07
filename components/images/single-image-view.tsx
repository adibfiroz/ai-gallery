"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Bookmark, Check, Download, Link2, Play, SquareArrowOutUpRight, X } from 'lucide-react';
import { Button } from '../ui/button';
var FileSaver = require('file-saver');
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { cn } from '@/lib/utils';
import { Collection, Image } from '@prisma/client';
import HeartButton from '../HeartButton';
import { getRelatedImages, getSingleImage, increamentDownloads, increamentViewsCount } from '@/app/actions/image';
import { useLoginModal } from '@/hooks/user-login-modal';
import toast from 'react-hot-toast';
import { increaseFreeDownloadLimit } from '@/lib/api-limit';
import { usePathname, useRouter } from 'next/navigation';
import CollectionButton from '../collection-button';
import { MAX_DOWNLOAD_LIMIT } from '@/constants';
import Category from '../category';
import { Image as AntImage, Dropdown, MenuProps, Modal } from 'antd';
import { fetchFreeDownloadCount } from '@/store/slices/freeDownloadSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { fetchCollections } from '@/store/slices/collectionSlice';
import { fetchSingleImage } from '@/store/slices/imageSlice';
import Masonry from 'react-masonry-css';
import { fetchCurrentUser } from '@/store/slices/userSlice';
import { fetchRelatedImages } from '@/store/slices/relatedImagesSlice';

interface SingleimageViewProps {
    imageId: string;
    data: Image | any
    isSubscribed: boolean
}


const SingleimageView = ({
    imageId,
    isSubscribed,
    data: serverData,
}: SingleimageViewProps) => {
    const [open2, setOpen2] = useState(false)
    const [copyLink, setCopyLink] = useState(false);

    const loginModal = useLoginModal()
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch();

    const { data: collections } = useAppSelector((state) => state.collection);
    const { data, loading } = useAppSelector((state) => state.image);
    const { count } = useAppSelector((state) => state.freeDownload);
    const { data: currentUser } = useAppSelector((state) => state.currentUser);
    const { data: relatedImages, loading: isLoading } = useAppSelector((state) => state.relatedImages);

    const currentImage = data;

    useEffect(() => {
        dispatch(fetchFreeDownloadCount());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchSingleImage({ imageId: imageId }))
    }, [imageId])

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchCollections());
        }
    }, [currentUser, dispatch]);

    useEffect(() => {
        if (currentImage?.tags) {
            dispatch(fetchRelatedImages({ tags: serverData.tags, imageId }));
        }
    }, [currentImage?.tags]);

    const hasFavorited = useMemo(() => {
        return collections?.some((collection: Collection) => currentImage && collection.imageIds.includes(currentImage?.id)) ?? false;
    }, [collections, currentImage?.id]);

    const handleCollectionModal = () => {
        setOpen2(!open2)
    }

    const handleRoute = async (id: string) => {
        router.replace(`/image/${id}`, { scroll: false })
        await increamentViewsCount({ imageId: id })
    }

    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>, item: Image) => {
        e.stopPropagation()
        if (!currentUser) {
            loginModal.onOpen();
            return
        }

        try {
            if (!isSubscribed) {
                if (item?.Pro) {
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
            FileSaver.saveAs(item?.img, `${item?.caption}.png`);
            await increamentDownloads({ imageId: item?.id })
        } catch (error) {
            toast.error("something went wrong!")
        }
    }

    const onCopyLink = () => {
        setCopyLink(true);
        setTimeout(() => setCopyLink(false), 3000);
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && currentImage) {
            document.title = `${currentImage.caption}`;
        }
    }, [data])

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    const items: MenuProps['items'] = [
        {
            label: (
                <CopyToClipboard text={`http://localhost:3000/${pathname}` || ""} onCopy={onCopyLink}>
                    <div className='flex items-center gap-2'>
                        <Link2 size={18} />
                        copy link
                    </div>
                </CopyToClipboard>
            ),
            key: '0',
        },
    ];

    useEffect(() => {
        if (pathname) {
            sessionStorage.setItem("prevRoute", pathname)
        }
    }, [])


    return (
        <div>
            <div className=' relative h-full'>
                {loading ?
                    <div className=' grid lg:grid-cols-3 '>
                        <div className=' lg:col-span-2 p-4'>
                            <div className='rounded-md bg-gray-200 animate-pulse h-[80vh] max-w-md mx-auto'></div>
                        </div>
                        <div className='p-4 mt-6'>
                            <div className='rounded-md bg-gray-200 animate-pulse h-[100px]'></div>

                            <div className='grid grid-cols-2 gap-5 mt-10'>
                                <div className='rounded-md bg-gray-200 animate-pulse h-8'></div>
                                <div className='rounded-md bg-gray-200 animate-pulse h-8'></div>
                                <div className='rounded-md bg-gray-200 animate-pulse h-8'></div>
                                <div className='rounded-md bg-gray-200 animate-pulse h-8'></div>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
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

                                                {serverData?.userlikeIds.length || 0}

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
                                    <Button onClick={(e) => handleDownload(e, data)} className={cn('bg-gradient-to-r rounded-full transition-all duration-300 from-teal-400 via-teal-500 h-10 gap-x-2  to-teal-600 hover:from-teal-500 hover:via-teal-600 hover:to-teal-700')}>
                                        <Download size={20} />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {currentImage?.tags.length > 0 &&
                            <div className='px-4 relative'>
                                <Category category={currentImage?.tags} />
                            </div>
                        }
                    </div>
                }


                <div className='px-4 relative'>
                    {isLoading ?
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pb-5'>
                            {Array.from({ length: 8 }, (_, index) => (
                                <div key={index} className=' aspect-3/4 rounded-xl bg-gray-200 animate-pulse'></div>
                            ))}
                        </div>
                        : relatedImages &&
                        <Masonry
                            breakpointCols={{
                                default: 6, // Default number of 7 columns
                                3000: 5, // For screens smaller than 3000px, 6 columns
                                2000: 4,   // For screens smaller than 2000px, 5 columns
                                1300: 4,   // For screens smaller than 1100px, 4 columns
                                1000: 3,   // For screens smaller than 1100px, 3 columns
                                700: 2,    // For screens smaller than 700px, 2 columns
                                400: 2    // For screens smaller than 500px, 1 column
                            }}
                            className="my-masonry-grid mt-4"
                            columnClassName="my-masonry-grid_column">
                            {relatedImages?.map((item: Image) => (
                                <div onClick={() => handleRoute(item.id)} key={item.id} className=' relative antImgBlock group/item select-none overflow-hidden cursor-pointer'>
                                    {item.Pro && <img src="/crown.png" width={25} height={25} className='md:hidden absolute left-3 top-3 z-10 shadow-lg' alt="proImage" />}

                                    <div className='md:hidden absolute z-10 p-3 flex justify-between bottom-0 left-0 right-0'>
                                        <Button onClick={(e) => handleDownload(e, item)} className='rounded-full transition-all duration-300 bg-transparent shadow-2xl backdrop-blur-md p-0 size-10 to-teal-700'>
                                            <Download size={22} />
                                        </Button>
                                        <HeartButton
                                            imageId={item.id}
                                            currentUser={currentUser}
                                        />
                                    </div>
                                    <div
                                        className="black-gradient invisible md:visible opacity-0 md:group-hover/item:opacity-100 transition-all duration-300 rounded-xl absolute left-0 right-0 z-10 bottom-0 h-full gap-2 flex flex-col justify-between p-3">
                                        <div className=' text-left'>
                                            {item.Pro && <img src="/crown.png" width={30} height={30} className='' alt="proImage" />}
                                        </div>
                                        <div className='flex justify-between'>
                                            <Button onClick={(e) => handleDownload(e, item)} className='bg-gradient-to-r rounded-full transition-all duration-300 from-teal-400 via-teal-500 h-10 gap-x-2  to-teal-600 hover:from-teal-500 hover:via-teal-600 hover:to-teal-700'>
                                                <Download size={20} />
                                                Download
                                            </Button>
                                            <HeartButton
                                                imageId={item.id}
                                                currentUser={currentUser}
                                            />
                                        </div>
                                    </div>
                                    <AntImage
                                        className='rounded-xl block'
                                        src={item?.img}
                                        fallback='/fallback-image.png'
                                        preview={false}
                                    />
                                </div>
                            ))}
                        </Masonry>
                    }
                </div>

            </div>

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
                        <div onClick={() => window.location.href = `/profile/${formattedName}/collections`} className='flex items-center gap-2 bg-black text-white rounded-xl py-4 px-6 cursor-pointer hover:opacity-85 w-fit mx-auto text-lg' >
                            Collections
                            <ArrowRight />
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default SingleimageView