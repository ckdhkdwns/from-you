import React from 'react';

import { getAllTemplates } from '@/models/actions/template-actions';
import { TemplatePublic } from '@/models/types/template';
import { TemplatesDataTable } from './_components/templates-data-table';
import { isSuccessResponse } from '@/models/types/response';

export default async function TemplatesPage() {
    let templates: TemplatePublic[] = [];
    const result = await getAllTemplates();

    if (isSuccessResponse(result)) {
        templates = result.data;
    } else {
        throw new Error(result.error?.message || '템플릿을 불러오는 중 오류가 발생했습니다.');
    }

    return (
        <div>
            <TemplatesDataTable initialTemplates={templates} />
        </div>
    );
}
