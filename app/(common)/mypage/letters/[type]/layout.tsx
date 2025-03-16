import React from 'react';

export default async function layout({ children }: { children: React.ReactNode }) {
    return <div className="py-12 h-full">{children}</div>;
}
