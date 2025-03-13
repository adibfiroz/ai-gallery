"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Bookmark, Check, Copy, Download, Link2, Play, SquareArrowOutUpRight, X } from 'lucide-react';
import { Button } from '../ui/button';
var FileSaver = require('file-saver');
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { cn } from '@/lib/utils';
import { Collection, } from '@prisma/client';
import { SafeImage, SafeUser } from '@/app/types';
import HeartButton from '../HeartButton';
import { increamentDownloads, increamentViewsCount } from '@/app/actions/image';
import { useLoginModal } from '@/hooks/user-login-modal';
import toast from 'react-hot-toast';
import { increaseFreeDownloadLimit } from '@/lib/api-limit';
import { useParams, usePathname, useRouter } from 'next/navigation';
import CollectionButton from '../collection-button';
import { MAX_DOWNLOAD_LIMIT, MAX_FREE_CAPTION_LIMIT, MAX_PRO_CAPTION_LIMIT } from '@/constants';
import Category from '../category';
import { Image as AntImage, Dropdown, MenuProps, Modal, Tooltip } from 'antd';
import { fetchFreeDownloadCount } from '@/store/slices/freeDownloadSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { fetchCollections } from '@/store/slices/collectionSlice';
import { fetchSingleImage } from '@/store/slices/imageSlice';
import Masonry from 'react-masonry-css';
import { setSingleImage, setTotalImages } from '@/store/slices/modalImagesSlice';
import { fetchRelatedImages } from '@/store/slices/relatedImageSlice';
import { Inter } from 'next/font/google';
import { capitalizeString } from '@/store';
import Link from 'next/link';
import axios from "axios"
import { fetchFreeCaptionCount, fetchProCaptionCount } from '@/store/slices/captionCountSlice';
const inter = Inter({ subsets: ['latin'] })

interface ImageModalProps {
    open: boolean;
    handleImageModal: () => void
    currentUser?: SafeUser | null
    isSubscribed: boolean
    count: number
}

const ImageModal = ({
    open,
    handleImageModal,
    currentUser,
    isSubscribed,
    count,
}: ImageModalProps) => {
    const [open2, setOpen2] = useState(false)
    const [copyLink, setCopyLink] = useState(false);
    const [captionModal, setCaptionModal] = useState(false);
    const [getCaption, setGetCaption] = useState("");
    const [copyCaption, setCopyCaption] = useState(false);
    const [copyPrompt, setCopyPrompt] = useState(false);
    const selectedImage = useAppSelector((state) => state.modalImages.singleImage);
    const totalImages = useAppSelector((state) => state.modalImages.totalImages);

    const [currentIndex, setCurrentIndex] = useState(totalImages?.findIndex(img => img.id === selectedImage?.id));

    const loginModal = useLoginModal()
    const router = useRouter()
    const pathName = usePathname()
    const params = useParams() as Record<string, string>;
    const decodedString = decodeURIComponent(params.searchItem);
    const dispatch = useAppDispatch();

    const { data: collections } = useAppSelector((state) => state.collection);
    const { data: singleImage, loading } = useAppSelector((state) => state.image);
    const { data: relatedImages, loading: isLoading } = useAppSelector((state) => state.relatedImages);
    const { freeCaptionCount, proCaptionCount } = useAppSelector(
        (state) => state.captionCount
    );

    const currentImage = singleImage;

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchFreeCaptionCount());
            dispatch(fetchProCaptionCount());
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchCollections());
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentImage?.tags) {
            dispatch(fetchRelatedImages({ tags: currentImage?.tags, imageId: selectedImage?.id }));
        }
    }, [currentImage?.tags]);

    const hasFavorited = useMemo(() => {
        return collections?.some((collection: Collection) => currentImage && collection.imageIds.includes(currentImage?.id)) ?? false;
    }, [collections, currentImage?.id]);

    const handleCollectionModal = () => {
        setOpen2(!open2)
    }

    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>, item: SafeImage) => {
        e.stopPropagation();
        e.preventDefault()
        if (!currentUser) {
            if (open) {
                handleImageModal()
            }
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

    const left = () => {
        if (scanLoading) {
            return
        }
        setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const right = () => {
        if (scanLoading) {
            return
        }
        setCurrentIndex(prevIndex => Math.min(prevIndex + 1, totalImages.length - 1));
    };


    useEffect(() => {
        // Update currentIndex whenever a new item is selected
        if (selectedImage) {
            const newIndex = totalImages.findIndex((img) => img.id === selectedImage.id);
            setCurrentIndex(newIndex);
        }
    }, [selectedImage, totalImages]);

    // Fetch new image when currentIndex changes
    useEffect(() => {
        if (currentIndex !== -1) {
            modalScroll()
            dispatch(fetchSingleImage({ imageId: totalImages[currentIndex]?.id }));
        }
    }, [currentIndex, dispatch, totalImages]);

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    const items: MenuProps['items'] = [
        {
            label: (
                <CopyToClipboard text={`${process.env.NEXT_PUBLIC_APP_URL}image/${selectedImage?.id}` || ""} onCopy={onCopyLink}>
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
        if (currentImage?.tags) {
            dispatch(fetchRelatedImages({ tags: currentImage?.tags, imageId: selectedImage?.id }));
        }
    }, [currentImage?.tags]);


    const handleData = async (item: SafeImage) => {
        if (scanLoading) {
            return
        }
        modalScroll()
        dispatch(setTotalImages(relatedImages));
        dispatch(setSingleImage(item))
        dispatch(fetchSingleImage({ imageId: item.id }))
        await increamentViewsCount({ imageId: item.id })
    };

    const modalScroll = () => {
        const modalBody = document.querySelector(".ant-modal-wrap");
        if (modalBody) {
            modalBody.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    useEffect(() => {
        if (open) {
            document.title = `${singleImage?.caption}`;
        } else if (pathName?.startsWith("/search")) {
            document.title = `${capitalizeString(decodedString)} AI Images, Download Best of ${capitalizeString(decodedString)} Images`
        } else if (pathName === "/") {
            document.title = "The Best of AI Images"
        } else if (pathName?.startsWith("/profile")) {
            if (formattedName) {
                document.title = formattedName
            }
        }
    }, [singleImage, open, pathName])

    const [scanLoading, setScanLoading] = useState(false)

    const handleCheckClose = () => {
        if (scanLoading) {
            return
        }
        dispatch(setTotalImages([]));
        dispatch(setSingleImage(null))
        handleImageModal()
    }

    const handleSubmit = async () => {
        setScanLoading(true)
        try {
            const response = await axios.post("/api/caption", {
                image: currentImage?.img,
            });
            setCaptionModal(true)
            setGetCaption(response.data)
            setScanLoading(false)
            if (isSubscribed) {
                dispatch(fetchProCaptionCount());
            } else {
                dispatch(fetchFreeCaptionCount());
            }
        } catch (error: any) {
            if (error?.response?.status === 403) {
                toast.error(error?.response?.data.message)
            } else if (error?.response?.status === 401) {
                toast.error(error?.response?.data.message)
            } else {
                toast.error("Something went wrong!")
            }
            setScanLoading(false)
        }
    }

    const itemsDrop: MenuProps['items'] = [
        {
            label: (
                <div>
                    {isSubscribed ?
                        <div className=' text-center mb-1'>
                            {proCaptionCount} / {MAX_PRO_CAPTION_LIMIT}
                        </div>
                        :
                        <div className=' text-center mb-1'>
                            {freeCaptionCount} / {MAX_FREE_CAPTION_LIMIT}
                        </div>
                    }

                    <Button onClick={handleSubmit} className='h-auto rounded-lg btn-green-gradient'>
                        Generate Caption
                    </Button>
                </div>
            ),
            key: '0',
            className: "!p-0"
        },
    ];

    const handleCaptionModal = () => setCaptionModal(!captionModal)

    const onCopyPrompt = () => {
        setCopyPrompt(true);
        setTimeout(() => setCopyPrompt(false), 3000);
    };

    const onCopyCaption = () => {
        setCopyCaption(true);
        setTimeout(() => setCopyCaption(false), 3000);
    };

    return (
        <Modal
            open={open}
            onCancel={handleCheckClose}
            width={1000}
            centered
            destroyOnClose={true}
            cancelButtonProps={{ hidden: true }}
            okButtonProps={{ hidden: true }}
            className=''>
            <div className={cn(' relative h-full', inter.className)}>
                {loading ?
                    <div className=' grid lg:grid-cols-3 '>
                        <div className=' lg:col-span-2 p-4'>
                            <div className='rounded-md bg-gray-200 animate-pulse h-[80vh] max-w-md mx-auto'></div>
                        </div>
                        <div className='p-4 mt-8'>
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
                                <div className='w-fit mx-auto relative'>
                                    <AntImage
                                        className={cn('max-h-[80vh] rounded-xl ', scanLoading && " animate-brightness")}
                                        src={currentImage?.img}
                                        fallback='/fallback-image.png'
                                        preview={!scanLoading}
                                    />

                                    <div className=' absolute right-3 bottom-3'>
                                        <Dropdown
                                            menu={{
                                                items: itemsDrop,
                                            }}
                                            placement="topRight"
                                            trigger={['click']}
                                            className='!px-0'
                                        >
                                            <Button disabled={scanLoading} className='h-6' onClick={(e) => e.preventDefault()}>
                                                <img src="/caption3.png" width={30} height={30} alt="" />
                                            </Button>
                                        </Dropdown>
                                    </div>

                                    {scanLoading && <div className="scan-line"></div>}
                                </div>
                            </div>
                            <div className=' h-full flex flex-col gap-y-5 justify-between'>
                                <div className='p-4'>
                                    <div className='text-left flex items-center gap-4 font-semibold text-[#69676e]'>
                                        <div>Prompt</div>
                                        <div className=" relative group/item">
                                            <Tooltip title="Copy Prompt">
                                                <div>
                                                    <CopyToClipboard text={currentImage?.caption} onCopy={onCopyPrompt}>
                                                        <div className="flex cursor-pointer items-center text-stone-600 gap-2 p-2 border border-stone-200 hover:bg-[#dedee760] text-sm rounded-lg">
                                                            {copyPrompt ?
                                                                <Check size={14} />
                                                                :
                                                                <Copy size={14} />
                                                            }
                                                        </div>
                                                    </CopyToClipboard>
                                                </div>
                                            </Tooltip>
                                        </div>

                                    </div>

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

                                                {currentImage?.userlikeIds.length || 0}

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
                                    <Button onClick={(e) => handleDownload(e, selectedImage)} className={cn('rounded-full transition-all duration-300 btn-green-gradient')}>
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

                {loading &&
                    <div className='flex gap-x-4 gap-4 px-4 '>
                        {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className=' w-32 h-10 rounded-lg bg-gray-200 animate-pulse'></div>
                        ))}
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
                            {relatedImages?.map((item: SafeImage) => (
                                <div onClick={() => handleData(item)} key={item.id} className=' relative antImgBlock group/item select-none overflow-hidden cursor-pointer'>
                                    {item.Pro && <img src="/crown.png" width={25} height={25} className='md:hidden absolute left-3 top-3 z-10 shadow-lg' alt="proImage" />}

                                    <div className='md:hidden absolute z-10 p-3 flex justify-between bottom-0 left-0 right-0'>
                                        <Button onClick={(e) => handleDownload(e, item)} className='rounded-full transition-all duration-300 bg-transparent shadow-2xl backdrop-blur-md p-0 size-10 to-teal-700'>
                                            <Download size={22} />
                                        </Button>
                                        <HeartButton
                                            open={open}
                                            imageId={item.id}
                                            currentUser={currentUser}
                                            handleImageModal={handleImageModal}
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
                                                open={open}
                                                imageId={item.id}
                                                currentUser={currentUser}
                                                handleImageModal={handleImageModal}
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

            {(selectedImage && currentIndex > 0) &&
                <button onClick={left} className=" p-2 group/item cursor-pointer fixed top-[45%] left-5 xl:left-16 text-white z-50 bg-black border border-gray-500 rounded-full ">
                    <Play size={18} className='fill-white transition-all duration-200 rotate-180 group-hover/item:text-[#00ffdf] group-hover/item:fill-[#00ffdf]' />
                </button>
            }
            {(selectedImage && currentIndex < totalImages.length - 1) &&
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
                    <div className='max-h-[50vh] bg-teal-500/10 overflow-y-auto space-y-3 p-4' style={{ scrollbarWidth: "thin" }}>
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
                        <Link href={`/profile/${formattedName}/collections`} className='flex items-center gap-2 bg-black text-white rounded-xl py-4 px-6 cursor-pointer hover:opacity-85 w-fit mx-auto text-lg' >
                            Collections
                            <ArrowRight />
                        </Link>
                    </div>
                </Modal>
            }


            <Modal
                open={captionModal}
                onCancel={handleCaptionModal}
                width={500}
                centered
                cancelButtonProps={{ hidden: true }}
                okButtonProps={{ hidden: true }}
            >
                <div className='p-4'>
                    <div className='text-xl text-left flex items-center gap-4 font-semibold'>
                        <div>Caption</div>
                        <div className=" relative group/item">
                            <Tooltip title="Copy Caption">
                                <div>
                                    <CopyToClipboard text={getCaption} onCopy={onCopyCaption}>
                                        <div className="flex cursor-pointer items-center text-stone-600 gap-2 p-2 border border-stone-200 hover:bg-[#dedee760] text-sm rounded-lg">
                                            {copyCaption ?
                                                <Check size={14} />
                                                :
                                                <Copy size={14} />
                                            }
                                        </div>
                                    </CopyToClipboard>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='bg-stone-600/5 w-full text-lg rounded-xl p-3 mt-3'>
                        {getCaption}
                    </div>
                </div>

            </Modal>
        </Modal>
    )
}

export default ImageModal