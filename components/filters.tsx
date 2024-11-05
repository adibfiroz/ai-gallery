"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";


const HomeFilters = () => {
    const [value, setValue] = useState("All");
    const [value2, setValue2] = useState("Popular");
    const params = useSearchParams()
    const router = useRouter();

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
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        router.push(url.toLowerCase());
    }, [value, value2, router, params]);

    useEffect(() => {
        handleClick()
    }, [value, value2])

    return (
        <div className="flex justify-between gap-x-3 items-center py-4">
            <div className="text-2xl font-bold hidden md:block">Browse {value2 === "Newest" ? "Latest" : value2} images</div>
            <div className="flex gap-x-3 flex-1 md:flex-grow-0">
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

    )
}

export default HomeFilters