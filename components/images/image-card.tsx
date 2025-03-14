"use client"

import { Download, X } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Masonry from 'react-masonry-css'
import ImageModal from './image-modal'
var FileSaver = require('file-saver');
import InfiniteScroll from "react-infinite-scroll-component";
import HeartButton from '../HeartButton'
import { SafeImage, SafeUser } from '@/app/types'
import { increamentDownloads, increamentViewsCount } from '@/app/actions/image'
import { useLoginModal } from '@/hooks/user-login-modal'
import { increaseFreeDownloadLimit, increaseTotalDownloadCount } from '@/lib/api-limit'
import toast from 'react-hot-toast'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { removeImagetoCollection } from '@/app/actions/collection'
import { MAX_DOWNLOAD_LIMIT } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { fetchFreeDownloadCount } from '@/store/slices/freeDownloadSlice'
import { Image as AntImage } from 'antd';
import { fetchCurrentUser } from '@/store/slices/userSlice'
import { fetchSingleImage } from '@/store/slices/imageSlice'
import { setSingleImage, setTotalImages } from '@/store/slices/modalImagesSlice'

interface ImageCardProps {
    data: SafeImage[] | any
    totalImages: SafeImage[] | any
    handleLoadMore: () => void
    currentUser?: SafeUser | null
    isSubscribed: boolean
    relatedImages?: SafeImage[]
    hasMoreImage: boolean
}


const ImageCard = ({ data, totalImages, hasMoreImage, relatedImages, isSubscribed, handleLoadMore }: ImageCardProps) => {
    const [open, setOpen] = useState(false)
    const [filterImage, setFilterImage] = useState(data)
    const loginModal = useLoginModal()
    const pathName = usePathname();
    const router = useRouter()
    const params = useParams()
    const dispatch = useAppDispatch();

    const { count, loading, error } = useAppSelector((state) => state.freeDownload);
    const { data: currentUser } = useAppSelector((state) => state.currentUser);

    useEffect(() => {
        dispatch(fetchFreeDownloadCount());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    const getCollectionId = params?.collectionId as string

    const handleImageModal = () => {
        setOpen(false)
    }

    const handleData = async (item: SafeImage) => {
        dispatch(setTotalImages(data));
        dispatch(setSingleImage(item))
        dispatch(fetchSingleImage({ imageId: item.id }))
        setOpen(true)
        await increamentViewsCount({ imageId: item.id })
    };

    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>, item: SafeImage) => {
        e.stopPropagation();
        e.preventDefault()
        if (!currentUser) {
            loginModal.onOpen();
            return
        }
        try {
            if (!isSubscribed) {
                if (item.Pro) {
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
            FileSaver.saveAs(item.img, `${item.caption}.png`);
            await increamentDownloads({ imageId: item?.id })
            await increaseTotalDownloadCount()
        } catch (error) {
            toast.error("something went wrong!")
        }
    }

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>, imageId: string) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            const filter = filterImage.filter((img: any) => img.id !== imageId);
            setFilterImage(filter)
            await removeImagetoCollection({ imageId, collectionId: getCollectionId });
        } catch (error) {
            toast.error("something went wrong!")
        }
    }

    useEffect(() => {
        setFilterImage(data)
    }, [data])

    return (
        <div>
            <InfiniteScroll
                dataLength={data?.length}
                next={handleLoadMore}
                hasMore={!!hasMoreImage}
                loader={<h3 className="flex justify-center mt-5"></h3>}
                endMessage={<h3 className=''></h3>}
            >
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
                    {filterImage?.map((item: any) => (
                        <div onClick={() => handleData(item)} key={item.id} className=' relative antImgBlock group/item select-none overflow-hidden cursor-pointer'>
                            {(pathName === `/profile/${formattedName}/collections/${getCollectionId}` && !relatedImages) &&
                                <Button onClick={(e) => handleRemove(e, item.id)} className='bg-white md:opacity-0 md:group-hover/item:opacity-100 rounded-full p-0 w-9 text-[#ff0000] hover:bg-gray-200 absolute right-3 top-3 z-20'>
                                    <X />
                                </Button>
                            }

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
            </InfiniteScroll>


            <ImageModal
                isSubscribed={isSubscribed}
                currentUser={currentUser}
                open={open}
                count={count}
                handleImageModal={handleImageModal}
            />

        </div>
    )
}

export default ImageCard