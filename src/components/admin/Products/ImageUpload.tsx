'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Camera, Loader2 } from 'lucide-react';

interface ImageUploadProps {
    currentImage?: string;
    onImageChange: (imageUrl: string) => void;
    onImageRemove: () => void;
    disabled?: boolean;
}

export default function ImageUpload({
    currentImage,
    onImageChange,
    onImageRemove,
    disabled = false
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const convertFileToBlob = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    };



    const handleFileSelect = async (file: File) => {
        if (!file || disabled) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setUploadError('File too large. Maximum size is 5MB.');
            return;
        }

        setUploading(true);
        setUploadError(null);

        try {
            // Convert to blob/base64 directly on client side
            const blobUrl = await convertFileToBlob(file);
            onImageChange(blobUrl);
        } catch (error) {
            console.error('Error converting image:', error);
            setUploadError('Failed to process image');
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setDragActive(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const openFileDialog = () => {
        if (!disabled && !uploading) {
            fileInputRef.current?.click();
        }
    };

    const handleRemoveImage = () => {
        if (!disabled) {
            onImageRemove();
            setUploadError(null);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                Product Image
            </label>

            {/* Current Image Display */}
            {currentImage && (
                <div className="relative inline-block">
                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-300">
                        <Image
                            src={currentImage}
                            alt="Product image"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    {!disabled && (
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none shadow-lg"
                            title="Remove image"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            )}

            {/* Upload Area */}
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    transition-all duration-200
                    ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    ${uploading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                    ${uploadError ? 'border-red-300 bg-red-50' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading || disabled}
                />

                {uploading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 text-blue-600 mb-2 animate-spin" />
                        <p className="text-sm text-gray-600">Processing image...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                            {currentImage ? (
                                <Camera className="h-6 w-6 text-gray-600" />
                            ) : (
                                <Upload className="h-6 w-6 text-gray-600" />
                            )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                                {currentImage ? 'Change image' : 'Upload a file'}
                            </span>
                            {' '}or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, WebP up to 5MB
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {uploadError && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md border border-red-200">
                    {uploadError}
                </div>
            )}
        </div>
    );
}