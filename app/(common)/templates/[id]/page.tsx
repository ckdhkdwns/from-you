import React from 'react';
import ReviewSection from './_components/review-section';
import { getTemplateById } from '@/models/actions/template-actions';
import ImageSection from './_components/image-section';
import { notFound } from 'next/navigation';
import TemplateInfoSection from './_components/template-info-section';
import { getTemplateReviewsAction } from '@/models/actions/review-actions';

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { success: templateSuccess, data: template } = await getTemplateById(id);
    const { success: reviewsSuccess, data: reviews } = await getTemplateReviewsAction(id);

    if (!templateSuccess || !template || !reviewsSuccess || !reviews) {
        return notFound();
    }

    return (
        <div className="container mx-auto py-0 md:py-8 px-0">
            <div
                className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-20 py-4 h-auto"
                style={{
                    gridTemplateColumns: '2fr 3fr',
                }}
            >
                <TemplateInfoSection template={template} />

                <ImageSection thumbnail={template.thumbnail} paperImage={template.paperImage} />
            </div>

            <div className="mt-16">
                <ReviewSection thumbnail={template.thumbnail} reviews={reviews} />
            </div>
        </div>
    );
}
