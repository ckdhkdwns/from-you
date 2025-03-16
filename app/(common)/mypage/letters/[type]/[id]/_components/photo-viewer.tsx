'use client';

import React from 'react';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { Photo } from '@/models/types/letter';

interface PhotoViewerProps {
    photos: Photo[];
}

export default function PhotoViewer({ photos }: PhotoViewerProps) {
    if (!photos || photos.length === 0) return null;

    return (
        <div className="p-6">
            <PhotoProvider>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4">
                    {photos.map((photo, index) => (
                        <PhotoView key={photo.id || index} src={photo.url}>
                            <div className="relative aspect-square overflow-hidden cursor-pointer">
                                <Image
                                    src={photo.url}
                                    alt={`편지 사진 ${index + 1}`}
                                    fill
                                    className="object-contain hover:opacity-90 transition-opacity"
                                />
                            </div>
                        </PhotoView>
                    ))}
                </div>
            </PhotoProvider>
        </div>
    );
}
