"use client";

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteUser } from '@/app/actions/user';

const SettingsPage = () => {
    const [open, setOpen] = useState(false)
    const [isLoading, setisLoading] = useState(false);
    const [hideNo, setHideNo] = useState(true)
    const router = useRouter()

    const handleDeleteModal = () => {
        setOpen(!open)
    }

    const submit = async () => {
        try {
            setHideNo(false)
            setisLoading(true)
            await deleteUser()
            toast.success("Your Account has been deleted!")
            setisLoading(false)
            router.push("/")
        } catch (error) {
            setisLoading(false)
            setHideNo(true)
            toast.error("something went wrong!")
        }
    }

    return (
        <div className='mt-10'>
            <div className='my-5 bg-stone-600/5 w-full text-sm rounded-xl p-4'>
                <h3 className=' text-4xl font-bold text-[#384261]'>Billing</h3>
                <div className='text-gray-600 my-5'>You are currently on a free plan</div>
                <Link href="/pricing" className='bg-gradient-to-r text-lg block w-fit text-white rounded-md py-3 px-6 from-teal-400 via-teal-500 to-teal-600'>Manage Billing</Link>
            </div>

            <div className='my-5 mt-10 bg-stone-600/5 w-full text-sm rounded-xl p-4'>
                <h3 className=' text-4xl font-bold text-[#384261]'>Account</h3>
                <div className='text-gray-600 my-5'>Deleting your account will permanently erase all your information from our database. This action cannot be reversed.</div>
                <Button onClick={handleDeleteModal} className=" bg-red-600 h-12 text-lg px-6 hover:bg-red-400">
                    Delete Account
                    <Trash2 className="ml-2" size={20} />
                </Button>
            </div>

            <Dialog open={open}>
                <DialogContent className=' w-[90%] sm:w-full  text-center !rounded-xl'>
                    <DialogTitle className='text-2xl'>Are you sure you want to Delete?</DialogTitle>
                    <img src="/delete-user.png" className='mx-auto' width={80} height={80} alt="delete" />
                    <div className=' flex justify-center gap-5'>
                        {hideNo && <Button onClick={handleDeleteModal} className='text-lg h-11 w-16'>No</Button>}
                        <Button disabled={isLoading} onClick={submit} className='bg-red-600 text-lg w-16 h-11 hover:bg-red-500'>
                            {isLoading ?
                                <img src="/btn-loading.gif" width={25} height={25} alt="loader" />
                                :
                                "Yes"
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SettingsPage