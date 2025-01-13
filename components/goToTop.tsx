"use client"

import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const GoToTop = () => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 200 && !visible) {
            setVisible(true);
        } else if (scrolled <= 200 && visible) {
            setVisible(false);
        }
    };


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
    };
    useEffect(() => {
        window.addEventListener('scroll', toggleVisible);
        return () => {
            window.removeEventListener('scroll', toggleVisible);
        };
    }, [visible]);

    return (
        <div className={cn(' text-center sticky z-30 w-fit mx-auto bottom-6', visible ? " block" : " hidden")}>
            <button className={cn("cursor-pointer border border-white/40 mt-3 z-10 mx-auto bg-[#384261] rounded-full ")} onClick={scrollToTop} style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,.3)" }}>
                <ArrowUp size={24} className=" text-white m-2" />
            </button>
        </div>
    );
};

export default GoToTop;