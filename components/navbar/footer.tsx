import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className=' bg-stone-900'>
            <div className=' container mx-auto'>
                <div className='flex flex-col sm:flex-row justify-between items-center p-4'>
                    <Link href="/" className='bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br transition-all duration-300 rounded-full h-14 w-14 flex items-center justify-center font-extrabold text-3xl text-white'>AI</Link>

                    <p className="mt-4 text-sm text-center text-gray-400 sm:mt-0">© Copyright {new Date().getFullYear()} AI-gallery, All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer