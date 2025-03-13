import {
    InstagramOutlined,
    YoutubeOutlined
} from '@ant-design/icons';
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className=''>
            <div className=''>
                <div className=' container mx-auto'>
                    <div className='grid lg:grid-cols-2 gap-4 p-4'>
                        <div className='grid grid-cols-2'>
                            <ul className='my-4'>
                                <h3 className='mb-4 text-stone-500 font-medium'>Quick Links</h3>
                                <li className='mb-2'>
                                    <Link className='hover:opacity-70' href="/">Home</Link>
                                </li>
                                <li className='mb-2'>
                                    <Link className='hover:opacity-70' href="/pricing">Pricing</Link>
                                </li>
                                {/* <li className='mb-2'>
                                    <Link className='hover:opacity-70' href="/">Your favourites</Link>
                                </li> */}
                            </ul>
                            <ul className='my-4'>
                                <h3 className='mb-4 text-stone-500 font-medium'>Company</h3>
                                <li className='mb-2'>
                                    <Link className='hover:opacity-70' href="/about">About</Link>
                                </li>
                                <li className='mb-2'>
                                    <Link className='hover:opacity-70' href="/contact">Contact</Link>
                                </li>
                                <li className='mb-2'>
                                    <Link className='hover:opacity-70' href="/privacy-policy">Privacy Policy</Link>
                                </li>
                                <li className='mb-2'>
                                    <Link className='hover:opacity-70' href="/terms-of-service">
                                        Terms of Use</Link>
                                </li>
                            </ul>
                        </div>

                        <div className='grid sm:grid-cols-2'>
                            <ul className='sm:my-4'>
                                <h3 className='mb-4 text-stone-500 font-medium'>Connect with us</h3>
                                <li className='mb-2 flex gap-4 flex-wrap mt-10'>
                                    <Link className='hover:opacity-70' href="/">
                                        <YoutubeOutlined className='text-2xl' />
                                    </Link>
                                    <Link className='hover:opacity-70' href="/">
                                        <InstagramOutlined className='text-2xl' />
                                    </Link>
                                </li>

                            </ul>
                            <ul className='my-4'>
                                <h3 className='mb-4 text-stone-500 font-medium'>Popular Searches</h3>
                                <li className='mb-2 flex gap-4 flex-wrap'>
                                    <Link className='hover:bg-teal-500/20 hover:text-teal-800 hover:border-teal-500/20 px-4 py-2 border border-stone-300 rounded-xl' href="/search/anime">Anime</Link>
                                    <Link className='hover:bg-teal-500/20 hover:text-teal-800 hover:border-teal-500/20 px-4 py-2 border border-stone-300 rounded-xl' href="/search/amazing">Amazing wallpapers</Link>
                                    <Link className='hover:bg-teal-500/20 hover:text-teal-800 hover:border-teal-500/20 px-4 py-2 border border-stone-300 rounded-xl' href="/search/cinematic">Cinematic images</Link>
                                    <Link className='hover:bg-teal-500/20 hover:text-teal-800 hover:border-teal-500/20 px-4 py-2 border border-stone-300 rounded-xl' href="/search/galaxies">Galaxies wallpapers</Link>
                                    <Link className='hover:bg-teal-500/20 hover:text-teal-800 hover:border-teal-500/20 px-4 py-2 border border-stone-300 rounded-xl' href="/search/nature">Nature images</Link>
                                    <Link className='hover:bg-teal-500/20 hover:text-teal-800 hover:border-teal-500/20 px-4 py-2 border border-stone-300 rounded-xl' href="/?sort=newest">New images</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-stone-900'>
                <div className=' container mx-auto'>
                    <div className='flex flex-col sm:flex-row justify-between items-center p-4'>
                        <Link href="/" className='bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br transition-all duration-300 rounded-full h-14 w-14 flex items-center justify-center font-extrabold text-3xl text-white'>AI</Link>

                        <p className="mt-4 text-sm text-center text-gray-400 sm:mt-0">© Copyright {new Date().getFullYear()} AI-gallery, All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer