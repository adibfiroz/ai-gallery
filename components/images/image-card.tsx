"use client"

import { Download, Heart, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Masonry from 'react-masonry-css'
import ImageModal from './image-modal'
import { Collection, Image, Orients } from '@prisma/client'
var FileSaver = require('file-saver');
import InfiniteScroll from "react-infinite-scroll-component";
import HeartButton from '../HeartButton'
import { SafeUser } from '@/app/types'
import { increamentDownloads, increamentViewsCount } from '@/app/actions/image'
import { useLoginModal } from '@/hooks/user-login-modal'
import { increaseFreeDownloadLimit } from '@/lib/api-limit'
import toast from 'react-hot-toast'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { removeImagetoCollection } from '@/app/actions/collection'
import { MAX_DOWNLOAD_LIMIT } from '@/constants'

interface ImageCardProps {
    data: Image[]
    totalImages: Image[]
    collections?: Collection[] | null
    handleLoadMore: () => void
    currentUser?: SafeUser | null
    isSubscribed: boolean
    freeCount: number
}

const ImageCard = ({ data, totalImages, isSubscribed, collections, freeCount, currentUser, handleLoadMore }: ImageCardProps) => {
    const [open, setOpen] = useState(false)
    const [selectedItems, setSelectedItems] = useState<Image | undefined>();
    const [filterImage, setFilterImage] = useState(data)
    const loginModal = useLoginModal()
    const pathName = usePathname();
    const router = useRouter()
    const params = useParams()

    const getCollectionId = params?.collectionId as string

    const handleImageModal = () => {
        setOpen(!open)
        setSelectedItems(undefined)
    }

    const handleData = async (item: Image) => {
        setOpen(true)
        setSelectedItems(item)
        await increamentViewsCount({ imageId: item.id })
    };

    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>, item: Image) => {
        e.stopPropagation();
        if (!currentUser) {
            loginModal.onOpen();
            return
        }
        try {
            if (!isSubscribed) {
                if (freeCount >= MAX_DOWNLOAD_LIMIT) {
                    toast.error("Subscribe for unlimited downloads")
                    return
                }
                await increaseFreeDownloadLimit()
                router.refresh();
            }
            FileSaver.saveAs(item.img, `${item.caption}.png`);
            await increamentDownloads({ imageId: item?.id })
        } catch (error) {
            toast.error("something went wrong!")
        }
    }

    const formattedName = currentUser?.name?.replace(/\s+/g, '-').toLowerCase();

    const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>, imageId: string) => {
        e.stopPropagation();
        try {
            const filter = filterImage.filter(img => img.id !== imageId);
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
                dataLength={data.length}
                next={handleLoadMore}
                hasMore={true}
                loader={<h3 className="flex justify-center mt-5"></h3>}
                endMessage={<h4>Nothing more to show</h4>}
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
                    className="my-masonry-grid mt-5"
                    columnClassName="my-masonry-grid_column">
                    {filterImage.map((item: Image) => (
                        <div onClick={() => handleData(item)} key={item.id} className=' relative group/item select-none overflow-hidden cursor-pointer'>
                            {pathName === `/profile/${formattedName}/collections/${getCollectionId}` &&
                                <Button onClick={(e) => handleRemove(e, item.id)} className='bg-white md:opacity-0 md:group-hover/item:opacity-100 rounded-full p-0 w-9 text-[#ff0000] hover:bg-gray-200 absolute right-4 top-4 z-20'>
                                    <X />
                                </Button>
                            }
                            <div
                                className="black-gradient invisible md:visible opacity-0 md:group-hover/item:opacity-100 transition-all duration-300 rounded-xl absolute left-0 right-0 z-10 bottom-0 h-full gap-2 flex flex-col justify-between p-4">
                                <div className=' text-right'></div>
                                <div className='flex justify-between'>
                                    <Button onClick={(e) => handleDownload(e, item)} className='bg-gradient-to-r from-teal-400 via-teal-500 h-10 gap-x-2 rounded-full to-teal-600'>
                                        <Download size={20} />
                                        Download
                                    </Button>
                                    <HeartButton
                                        imageId={item.id}
                                        currentUser={currentUser}
                                    />
                                </div>
                            </div>
                            <img src={item.img} loading='lazy' className=' rounded-xl' alt="" />
                        </div>
                    ))}
                </Masonry>
            </InfiniteScroll>

            <ImageModal
                collections={collections}
                freeCount={freeCount}
                isSubscribed={isSubscribed}
                currentUser={currentUser}
                totalImages={totalImages}
                data={selectedItems}
                open={open}
                handleImageModal={handleImageModal}
            />
        </div>
    )
}

export default ImageCard