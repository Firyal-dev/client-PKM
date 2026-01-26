'use client'

import { useState, ChangeEvent } from "react"

export function useImagePreview() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const resetPreview = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
    };

    return { previewUrl, selectedFile, handleFileChange, resetPreview };
}