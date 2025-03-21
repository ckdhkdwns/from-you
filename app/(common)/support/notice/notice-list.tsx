import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';
import { NoticePublic } from '@/models/types/notice';
import { removeTableKeyPrefix } from '@/lib/api-utils';

export default function NoticeList({
    notices,
    defaultOpen,
}: {
    notices: NoticePublic[];
    defaultOpen?: string;
}) {
    return (
        <div>
            <Accordion type="single" collapsible className="w-full" defaultValue={defaultOpen}>
                {notices.map((notice, index) => {
                    return (
                        <AccordionItem value={removeTableKeyPrefix(notice?.SK)} key={index}>
                            <AccordionTrigger>
                                <div>{notice.title}</div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="whitespace-pre-line">{notice.content}</div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
