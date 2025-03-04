"use client"

import React from 'react'
import { motion } from "framer-motion"

const HeaderBanner = () => {
    return (
        <div className="rounded-2xl p-4 h-52 bg-no-repeat bg-cover bg-bottom bg-[linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('/backBanner.jpg')]">
            <div className="flex justify-center items-center leading-[55px] text-white h-full text-5xl font-extrabold">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >Built Only For <span className=' font-extrabold text-emerald-400 animate-pulse'> AI </span>
                </motion.div>
            </div>
        </div>
    )
}

export default HeaderBanner