import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';

export default function PreviewReviewDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Preview</Button>
            </DialogTrigger>
        </Dialog>
    );
}
