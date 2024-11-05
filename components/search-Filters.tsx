"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Image } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";

interface SearchFiltersProps {
    count: Image[]
}

const SearchFilters = ({ count }: SearchFiltersProps) => {
    const [value, setValue] = useState("All");
    const [value2, setValue2] = useState("Popular");
    const params = useSearchParams()
    const router = useRouter();
    const pathName: any = usePathname()

    const searchParams = pathName.split("/")[2]
    const decodedString = decodeURIComponent(searchParams);

    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = queryString.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            orientation: value === "All" ? undefined : value,
            sort: value2 === "Popular" ? undefined : value2,
        }

        if (params?.get('orientation') === value || params?.get('sort') === value2) {
            delete updatedQuery.orientation;
            delete updatedQuery.sort;
        }

        const url = queryString.stringifyUrl({
            url: `/search/${searchParams}`,
            query: updatedQuery
        }, { skipNull: true });

        router.push(url.toLowerCase());
    }, [value, value2, router, params]);

    useEffect(() => {
        handleClick()
    }, [value, value2])

    return (
        <div>
            <h2 className="text-3xl py-4 md:text-4xl text-left w-full text-wrap font-semibold capitalize text-[#384261]" style={{ wordBreak: "break-word" }}>
                {count.length === 0 ?
                    <div>no results found for <span className=" text-gray-400">"{decodedString}"</span></div>
                    : <div>{decodedString}</div>
                }
            </h2>
            <div className="flex flex-col md:flex-row justify-between gap-x-3 gap-y-5 items-center py-4">
                <div className="w-fit rounded-full px-6 py-3 bg-teal-500/10">
                    Images
                    <span className="text-teal-700"> {count.length}</span>
                </div>
                <div className="flex gap-x-3 flex-1 w-full md:flex-grow-0">
                    <Select value={value} onValueChange={setValue}>
                        <SelectTrigger className="flex-1 md:w-[180px] h-12">
                            <SelectValue placeholder="Oreintation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Landscape">Landscape</SelectItem>
                            <SelectItem value="Portrait">Portrait</SelectItem>
                            <SelectItem value="Square">Square</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={value2} onValueChange={setValue2}>
                        <SelectTrigger className="flex-1 md:w-[180px] h-12">
                            <SelectValue placeholder="sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Popular">Popular</SelectItem>
                            <SelectItem value="Newest">Newest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

    )
}

export default SearchFilters