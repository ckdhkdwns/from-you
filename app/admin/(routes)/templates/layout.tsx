import React from 'react';
import TemplatesProvider from './_contexts/templates-provider';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-6">
            <TemplatesProvider>{children}</TemplatesProvider>
        </div>
    );
}
