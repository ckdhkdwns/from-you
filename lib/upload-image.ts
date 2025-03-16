export const uploadImage = async (url: string, file: File) => {
    const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
            'Content-Disposition': `attachment; filename="${file.name}"`,
        },
    });
    return response;
};
