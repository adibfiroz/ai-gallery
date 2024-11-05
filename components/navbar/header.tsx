"use client"

import Link from 'next/link'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Search, SendHorizonal } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { useLoginModal } from '@/hooks/user-login-modal'
import { UserAvatar } from './user-avatar'
import { cn } from '@/lib/utils'
import { SafeUser } from '@/app/types'
import toast from 'react-hot-toast'
import { CreateImage } from '@/app/actions/image'

type RecentSearches = string[];

interface HeaderProps {
    currentUser?: SafeUser | null
}

enum Orients {
    landscape = 'landscape',
    portrait = 'portrait',
    square = 'square'
}

interface FormValues {
    caption: string;
    img: string;
    orientation: Orients;
    tags: string[];
}

interface TagInputProps {
    tags: string[];
    setTags: Dispatch<SetStateAction<string[]>> | any;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = inputValue.trim().toLowerCase();

            if (newTag === '') return;
            if (tags.includes(newTag)) {
                setInputValue('');
                return;
            }

            if (inputValue.trim() !== '' && tags.length < 10) {
                setTags([...tags, inputValue.trim().toLowerCase()]);
                setInputValue('');
            }
        }
    };


    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tags (optional)</label>
            <div className="flex flex-wrap items-center p-2 bg-gray-100 rounded-md">
                {tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-white text-gray-800 px-2 py-1 rounded-full m-1">
                        <span>{tag}</span>
                        <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => removeTag(tag)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
                {tags.length < 30 && (
                    <input
                        disabled={tags.length === 10 ? true : false}
                        type="text"
                        placeholder="Enter tags"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={addTag}
                        className={cn(`outline-none lowercase bg-transparent flex-1 p-2`, tags.length === 10 && " opacity-50 cursor-not-allowed")}
                    />
                )}
            </div>
            <div className="text-right text-xs text-gray-500">{tags.length}/10</div>
        </div>
    );
};


const Header = ({ currentUser }: HeaderProps) => {
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [dropDown, setDropDown] = useState(false)
    const [search, setSearch] = useState("")
    const router = useRouter()
    const loginModal = useLoginModal();
    const [recentSearches, setRecentSearches] = useState<RecentSearches>([]);

    const [formValues, setFormValues] = useState<FormValues>({
        caption: '',
        img: '',
        orientation: Orients.landscape,
        tags: []
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await CreateImage({ ...formValues })
            toast.success("success")
            setFormValues({
                caption: "",
                img: "",
                orientation: Orients.landscape,
                tags: []
            });
            handleUploadModal()
            router.refresh()
        } catch (error) {
            console.log(error)
        }
    };

    const setTags = (newTags: string[]) => {
        setFormValues({ ...formValues, tags: newTags });
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = evt.target.value;
        const maxValueLength = 60; // Maximum number of digits allowed

        // Check if the length of the input value exceeds the maximum value length
        if (inputValue.length > maxValueLength) {
            // If it exceeds, truncate the input value to the maximum length
            evt.target.value = inputValue.slice(0, maxValueLength);
        }
        setSearch(evt.target.value);
    };

    const handleSearchModal = () => {
        setOpen(!open)
        setSearch("")
    }

    const handleUploadModal = () => {
        setOpen2(!open2)
    }

    const saveSearch = (searchTerm: string): void => {
        let searches: RecentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        // Remove the searchTerm if it exists to avoid duplicates
        searches = searches.filter((term: string) => term !== searchTerm);

        // Add the new search term to the beginning
        searches.unshift(searchTerm);

        // Limit to 10 recent searches
        if (searches.length > 10) {
            searches = searches.slice(0, 10);
        }

        // Save updated recent searches to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(searches));

        // Update the state with the new recent searches
        router.replace(`/search/${searchTerm.toLowerCase()}`)
        handleSearchModal()
        setRecentSearches(searches);
    };


    const handleDrop = () => {
        if (recentSearches.length === 0) {
            setDropDown(false)
        } else {
            setDropDown(true)
        }
    }


    // Function to retrieve recent searches from localStorage
    const getRecentSearches = (): RecentSearches => {
        return JSON.parse(localStorage.getItem('recentSearches') || '[]') as RecentSearches;
    };

    // Function to clear recent searches
    const clearRecentSearches = (): void => {
        localStorage.removeItem('recentSearches');
        setRecentSearches([]);
    };


    // Fetch recent searches on component mount
    useEffect(() => {
        setRecentSearches(getRecentSearches());
    }, []);


    return (
        <header className='sticky top-0 z-30 shadow-sm bg-white'>
            <div className=' container mx-auto'>
                <div className='flex justify-between items-center'>
                    <Link href="/">
                        <div className='font-bold p-4 whitespace-nowrap text-xl sm:text-2xl text-stone-700'><span className=' font-extrabold text-teal-500'>AI</span>-Gallery</div>
                    </Link>

                    <div className='mr-4 flex gap-x-5 items-center'>

                        <div onClick={() => setOpen(!open)} className='border hover:border-teal-500 p-2 cursor-pointer flex items-center border-stone-800/30 rounded-full'>
                            <Search size={20} className=' text-stone-700' />
                        </div>

                        <Link href="/pricing" className='hidden sm:block px-4 py-2 bg-stone-800/10 hover:bg-stone-800/15 rounded-full transition-all duration-200'>
                            Pricing
                        </Link>

                        {currentUser ?
                            <UserAvatar currentUser={currentUser} />
                            :
                            <Button onClick={loginModal.onOpen} className='bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br transition-all duration-300 shadow-lg shadow-teal-500/50 dark:shadow-lg rounded-full px-6 h-10 text-[16px]'>Login</Button>
                        }
                    </div>
                </div>
            </div>

            <Dialog open={open} onOpenChange={handleSearchModal}>
                <DialogContent className=' w-[90%] sm:w-full max-w-xl !rounded-none border-0 !bg-transparent data-[state=open]:top-[10%] p-0'>
                    <DialogTitle className=' hidden'></DialogTitle>
                    <div className=' relative'>
                        <Search className=' absolute left-2 top-4 text-stone-500' />

                        <input
                            onChange={handleChange}
                            onFocus={handleDrop}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveSearch((e.target as HTMLInputElement).value);
                                }
                            }}
                            className={cn(' outline-none px-10 py-4 rounded-md w-full', dropDown && " rounded-b-none")}
                            placeholder="search images"
                            type='text' />

                        {search.length > 1 &&
                            <Button onClick={() => saveSearch(search)} className='cursor-pointer absolute right-2 top-4 p-0 bg-transparent hover:bg-transparent border-0 h-auto shadow-none'>
                                <SendHorizonal className=' text-teal-500' />
                            </Button>
                        }

                        {dropDown &&
                            <ul className=' absolute top-14 -left-0 -right-0 border rounded-b-md bg-white p-4'>
                                <li className='flex justify-between pb-4'>
                                    <span> Recent searches</span>
                                    <div className=' cursor-pointer' onClick={clearRecentSearches}>clear</div>
                                </li>
                                <li className='flex flex-wrap gap-4 overflow-auto'>
                                    {recentSearches.map((searchItem, index) => (
                                        <div onClick={() => saveSearch(searchItem)} key={index} className='px-6 py-3 lowercase bg-white whitespace-nowrap border rounded-md cursor-pointer shadow-sm'>{searchItem}</div>
                                    ))}
                                </li>
                            </ul>
                        }
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={open2} onOpenChange={handleUploadModal}>
                <DialogContent className=' w-[90%] sm:w-full max-w-xl border-0'>
                    <DialogTitle className=' hidden'></DialogTitle>
                    <div className=' relative'>
                        <form onSubmit={handleSubmit} className="">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Caption</label>
                                <input
                                    type="text"
                                    name="caption"
                                    value={formValues.caption}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter caption"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                                <input
                                    type="text"
                                    name="img"
                                    value={formValues.img}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter image URL"
                                    required
                                />
                            </div>
                            {formValues?.img && <img src={formValues.img} width={50} height={50} alt="" />}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Orientation</label>
                                <select
                                    name="orientation"
                                    value={formValues.orientation}
                                    onChange={handleInputChange}
                                    className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value={Orients.landscape}>Landscape</option>
                                    <option value={Orients.portrait}>Portrait</option>
                                    <option value={Orients.square}>Square</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <TagInput tags={formValues.tags} setTags={setTags} />
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

        </header>
    )
}

export default Header