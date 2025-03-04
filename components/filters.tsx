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
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion"

interface HomeFiltersProps {
    initialOrientation?: string;
    initialSort?: string;
}

const HomeFilters = ({
    initialOrientation,
    initialSort
}: HomeFiltersProps) => {

    const router = useRouter();
    const pathName: any = usePathname()

    const searchParams = useSearchParams();

    // Initialize state from URL params or default props
    const [value, setValue] = useState(() => {
        return searchParams ? searchParams.get("orientation") || initialOrientation || "All" : "All";
    });

    const [value2, setValue2] = useState(() => {
        return searchParams ? searchParams.get("sort") || initialSort || "popular" : "popular";
    });

    useEffect(() => {
        if (!searchParams) return; // Prevent running on SSR

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

        router.push(url.toLowerCase());
    }, [value, value2, router, pathName]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-between gap-x-3 items-center py-4">
            <div className="text-2xl font-bold hidden md:block">Browse {value2 === "Newest" ? "Latest" : value2} images</div>
            <div className="flex gap-x-3 flex-1 md:flex-grow-0">
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
                    </SelectContent>
                </Select>
            </div>
        </motion.div>

    )
}

export default HomeFilters