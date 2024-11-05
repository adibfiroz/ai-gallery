'use client';

import { SafeUser } from '@/app/types';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    currentUser?: SafeUser | null
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    currentUser
}) => {
    const router = useRouter();
    const params = useParams()
    const getParams = params?.userId as string
    const stringWithSpaces = getParams.replace(/-/g, ' ').toLowerCase();

    useEffect(() => {
        if (stringWithSpaces !== currentUser?.name?.toLowerCase()) {
            router.replace("/");
        }
    }, [])

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;