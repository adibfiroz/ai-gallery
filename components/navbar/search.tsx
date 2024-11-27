"use client";

import { Search, SendHorizonal } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type RecentSearches = string[];

const SearchComponent = () => {
    const [open, setOpen] = useState(false)
    const [dropDown, setDropDown] = useState(false)
    const [search, setSearch] = useState("")
    const router = useRouter()
    const [recentSearches, setRecentSearches] = useState<RecentSearches>([]);

    const handleSearchModal = () => {
        setOpen(!open)
        setSearch("")
    }

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = evt.target.value;
        const maxValueLength = 60; // Maximum number of digits allowed

        if (!inputValue.trim()) return
        // Check if the length of the input value exceeds the maximum value length
        if (inputValue.length > maxValueLength) {
            // If it exceeds, truncate the input value to the maximum length
            evt.target.value = inputValue.slice(0, maxValueLength);
        }
        setSearch(evt.target.value);
    };

    const handleEnter = (e: any) => {
        if (e.key === 'Enter') {
            if (!search.trim()) return
            saveSearch(e.target.value);
        }
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
        router.replace(`/search/${searchTerm.toLowerCase().trim()}`)
        handleSearchModal()
        setRecentSearches(searches);
    };

    // Function to retrieve recent searches from localStorage
    const getRecentSearches = (): RecentSearches => {
        return JSON.parse(localStorage.getItem('recentSearches') || '[]') as RecentSearches;
    };


    const handleDrop = () => {
        if (recentSearches.length === 0) {
            setDropDown(false)
        } else {
            setDropDown(true)
        }
    }
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
        <div>
            <div onClick={() => setOpen(!open)} className='border hover:border-teal-500 p-2 cursor-pointer flex items-center border-stone-800/30 rounded-full'>
                <Search size={20} className=' text-stone-700' />
            </div>

            <Dialog open={open} onOpenChange={handleSearchModal}>
                <DialogContent className=' w-[90%] sm:w-full max-w-xl !rounded-none border-0 !bg-transparent data-[state=open]:top-[10%] p-0'>
                    <DialogTitle className=' hidden'></DialogTitle>
                    <div className=' relative'>
                        <Search className=' absolute left-2 top-4 text-stone-500' />

                        <input
                            onChange={handleChange}
                            onFocus={handleDrop}
                            onKeyDown={handleEnter}
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
        </div>
    )
}

export default SearchComponent