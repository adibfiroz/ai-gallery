"use client"

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion"
import { useParams } from 'next/navigation';

interface SliderItemProps {
    label: string;
}

const SliderItem: React.FC<SliderItemProps> = ({ label }) => {

    return (
        <Link href={`/search/${label}`} className={cn("px-6 py-3 bg-white whitespace-nowrap border rounded-md shadow-sm hover:bg-teal-500/20 hover:text-teal-800 hover:border-teal-500/20 cursor-pointer transition-all duration-300 lowercase text-[16px]")}>
            {label}
        </Link>
    );
};

interface CategoryProps {
    category?: string[] | null
}

const Category = ({ category }: CategoryProps) => {

    const items = category

    const sliderRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const params = useParams() as Record<string, string>;

    const decodedString = decodeURIComponent(params.searchItem);

    // Handle scroll positions
    const handleScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const scrollLeft = () => {
        sliderRef.current?.scrollBy({ left: -600, behavior: 'smooth' });
    };

    const scrollRight = () => {
        sliderRef.current?.scrollBy({ left: 600, behavior: 'smooth' });
    };

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.addEventListener('scroll', handleScroll);
            // Trigger scroll event on mount to set initial state
            handleScroll();
        }
        return () => {
            sliderRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='sticky top-[58px] z-20 sm:top-16 bg-white'>
            {items?.length &&
                <div className=' relative py-4 '>
                    {canScrollLeft && (
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 whiteL-gradient pr-10 py-4 z-10"
                            onClick={scrollLeft}
                        >
                            <ChevronLeft size={22} />
                        </button>
                    )}

                    <div ref={sliderRef} className="flex space-x-3 overflow-x-scroll scrollHide">
                        {items
                            .filter(
                                (option) =>
                                    option !== decodedString
                            ).map((item, index) => (
                                <SliderItem key={index} label={item} />
                            ))}
                    </div>

                    {canScrollRight && (
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 pl-10 whiteR-gradient py-4 z-10 "
                            onClick={scrollRight}
                        >
                            <ChevronRight className='' size={22} />
                        </button>
                    )}
                </div>
            }
        </motion.div>
    )
}

export default Category