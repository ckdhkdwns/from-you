'use client';

interface SectionContainerProps {
    title: string;
    children: React.ReactNode;
}

export function SectionContainer({ children }: SectionContainerProps) {
    return (
        <div>
            <div className="space-y-2">{children}</div>
        </div>
    );
}
