import React from 'react';
import BodyClassModifier from './body-class-modifier';

// export const viewport: Viewport = {
//     width: "device-width",
//     initialScale: 1,
//     maximumScale: 3,
//     userScalable: true,
//     viewportFit: "auto",
// };

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-0 bg-primary-pink">
            <BodyClassModifier htmlClassName="write-page" bodyClassName="write-mode" />
            <div className="bg-primary-ivory md:container mx-auto !p-0 max-h-[100dvh] h-[100dvh] shadow-md overflow-none">
                {children}
            </div>
        </div>
    );
}
