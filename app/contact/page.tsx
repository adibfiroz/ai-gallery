"use client"

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';


const ContactPage = () => {
    const form = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!form.current) return;

        emailjs
            .sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                form.current,
                {
                    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
                })
            .then(
                () => {
                    console.log('SUCCESS!');
                    setLoading(false);
                    form.current?.reset()
                    toast.success("Your message has been sent.")
                },
                (error) => {
                    console.log('FAILED...', error.text);
                    toast.error("Somehting went wrong.")
                },
            );
    };

    useEffect(() => {
        document.title = "Contact - Pixsider"
    })

    return (
        <div>
            <div className=' max-w-2xl mx-auto p-4  text-center '>
                <h2 className='text-3xl font-medium mb-4'>Contact us</h2>
                <div>
                    <span>you can directly </span>
                    <Link className='text-blue-600 underline' href="mailto:support@pixsider.com">Contact us</Link>,
                    our team will get back to you as soon as possible.
                </div>

                <div className='text-left mt-8'>
                    <form ref={form} onSubmit={sendEmail}>
                        <div className='mb-6'>
                            <label className=''>Your Name <span className='text-red-500 font-semibold'>*</span></label>
                            <input
                                className='w-full mt-1 border border-stone-300 rounded-md outline-none px-4 py-3' type="text" name="user_name"
                                required
                            />
                        </div>
                        <div className='mb-6'>
                            <label>Your Email <span className='text-red-500 font-semibold'>*</span></label>
                            <input
                                className='w-full mt-1 border border-stone-300 rounded-md outline-none px-4 py-3' type="email" name="user_email"
                                required
                            />
                        </div>
                        <div className='mb-6'>
                            <label>Description <span className='text-red-500 font-semibold'>*</span></label>
                            <textarea
                                className='w-full mt-1 border min-h-32 border-stone-300 rounded-md outline-none px-4 py-3' name="message"
                                required
                            />
                        </div>
                        <div>
                            <div className='text-center'>
                                <Button disabled={loading} className='bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br transition-all duration-300 shadow-lg shadow-teal-500/50 dark:shadow-lg rounded-md px-12 h-12 text-[16px]'>Submit</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ContactPage