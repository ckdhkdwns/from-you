import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
    return <div className=" container mx-auto">{children}</div>;
}
