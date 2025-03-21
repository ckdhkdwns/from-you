import Loader from '@/components/ui/loader';
import React from 'react';

export default function loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader />
        </div>
    );
}
