import { TemplatePublic } from '@/models/types/template';
import React from 'react';
import TemplateCard from '../../_components/template-card';

export default function TemplateGrid({ templates }: { templates: TemplatePublic[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {templates.map((template, index) => (
                <div key={index}>
                    <TemplateCard template={template} />
                </div>
            ))}
        </div>
    );
}
