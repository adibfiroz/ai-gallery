import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'About - Pixsider',
}

const AboutPage = () => {
    return (
        <div>
            <div className="p-4 h-72 bg-no-repeat bg-cover bg-bottom bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/backBanner.jpg')]">
                <div className="flex justify-center items-center  text-white h-full ">
                    <div className='text-center'>
                        <h1 className='text-5xl leading-[55px] font-extrabold'>About Us</h1>
                        <p className=' text-2xl font-medium mt-4'>AI-Powered Images, Curated for Creativity.</p>
                    </div>
                </div>
            </div>

            <div className='my-10 p-4'>
                <div className='max-w-4xl mx-auto font-medium terms'>
                    <h2 className='text-4xl font-semibold mb-5'>About Us</h2>
                    <p>Welcome to Pixsider, your go-to AI image gallery for high-quality, curated AI images. Our platform operates on a subscription model, providing users with access to an extensive collection of AI visuals tailored for creative professionals, businesses, and enthusiasts.</p>

                    <p>
                        At Pixsider, we believe in the power of AI to revolutionize digital content. Our team carefully curates and adds AI-generated images to our growing collection, ensuring that our users have access to unique and high-resolution visuals. Additionally, we provide tools for generating captions, making it easier to enhance and personalize your downloaded images.
                    </p>

                    <p>
                        Whether you need stunning images for your projects, marketing materials, or creative inspiration, Pixsider is here to provide a seamless and high-quality experience.
                    </p>

                    <p>
                        Join us and explore the future of AI-driven imagery.

                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutPage