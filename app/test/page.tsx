import React from 'react';

export default function page() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <textarea
                style={{
                    border: '1px solid #ccc',
                    width: '100%',
                    maxWidth: 500,
                    aspectRatio: '146/210',
                    backgroundImage: "url('/blank-letter.png')",
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    padding: '16px 48px',
                    lineHeight: '30px',
                }}
            />
        </div>
    );
}
