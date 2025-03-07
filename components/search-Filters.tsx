"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"

interface SearchFiltersProps {
    count: any
    isSubscribed: boolean
    initialOrientation?: string;
    initialSort?: string;
}

const SearchFilters = ({ count, isSubscribed, initialOrientation, initialSort }: SearchFiltersProps) => {
    const router = useRouter();
    const pathName: any = usePathname()

    const searchParams = useSearchParams();

    const getSearchTag = pathName.split("/")[2]
    const decodedString = decodeURIComponent(getSearchTag);

    // Initialize state from URL params or default props
    const [value, setValue] = useState(() => {
        return searchParams ? searchParams.get("orientation") || initialOrientation || "All" : "All";
    });

    const [value2, setValue2] = useState(() => {
        return searchParams ? searchParams.get("sort") || initialSort || "popular" : "popular";
    });

    useEffect(() => {
        if (!searchParams || pathName.startsWith("/image/")) return;

        const currentParams = queryString.parse(searchParams.toString());

        const updatedParams = {
            ...currentParams,
            orientation: value === "All" ? undefined : value,
            sort: value2 === "popular" ? undefined : value2,
        };

        const url = queryString.stringifyUrl(
            { url: pathName, query: updatedParams },
            { skipNull: true }
        );

        router.replace(url.toLowerCase(), { scroll: false });
    }, [value, value2, router, pathName]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
        >
            <h2 className="text-3xl py-4 md:text-4xl text-left w-full text-wrap font-semibold capitalize text-[#384261]" style={{ wordBreak: "break-word" }}>
                {parseInt(count) === 0 ?
                    <div>no results found for <span className=" text-gray-400">{`"`}{decodedString}{`"`}</span></div>
                    : <div>{decodedString}</div>
                }
            </h2>
            <div className="flex flex-col md:flex-row justify-between gap-x-3 gap-y-5 items-center py-4">
                <div className="w-fit rounded-full px-6 py-3 bg-teal-500/10">
                    Images
                    <span className="text-teal-700"> {count}</span>
                </div>
                <div className="flex gap-x-3 flex-1 w-full md:flex-grow-0">
                    <Select value={value} onValueChange={setValue}>
                        <SelectTrigger className="flex-1 md:w-[180px] h-12">
                            <SelectValue placeholder="Oreintation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="landscape">Landscape</SelectItem>
                            <SelectItem value="portrait">Portrait</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={value2} onValueChange={setValue2}>
                        <SelectTrigger className="flex-1 md:w-[180px] h-12">
                            <SelectValue placeholder="sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popular">Popular</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="featured" className="" disabled={!isSubscribed}>
                                <div className="inline-flex gap-2">
                                    <span>Featured</span>
                                    <img src="/crown.png" width={18} height={18} className='' alt="proImage" />
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </motion.div>

    )
}

export default SearchFilters