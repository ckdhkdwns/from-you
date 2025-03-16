import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
    return <div className="p-6">{children}</div>;
}
