import * as React from 'react';
import { cn } from '@/lib/utils';
import { CameraIcon } from 'lucide-react';

type FileUploadVariant = 'default' | 'icon';

interface FileUploadProps {
    value?: File | null;
    currentUrl?: string | null;
    onChange: (file: File | null) => void;
    accept?: string;
    maxSize?: number;
    className?: string;
    error?: string;
    variant?: FileUploadVariant;
    fallback?: React.ReactNode;
}

function FileUpload({
    value,
    currentUrl,
    onChange,
    accept = 'image/*',
    maxSize = 2 * 1024 * 1024,
    className,
    error,
    variant = 'default',
    fallback,
}: FileUploadProps) {
    const [preview, setPreview] = React.useState<string | null>(null);
    const [sizeError, setSizeError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (value) {
            const url = URL.createObjectURL(value);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(null);
    }, [value]);

    const displayUrl = preview || currentUrl;

    const handleFile = (file: File) => {
        setSizeError(null);

        if (maxSize && file.size > maxSize) {
            const sizeMB = (maxSize / 1024 / 1024).toFixed(0);
            setSizeError(`File size must be less than ${sizeMB}MB`);
            return;
        }

        onChange(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const displayError = error || sizeError;

    if (variant === 'icon') {
        return (
            <div className={cn('relative', className)}>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        'group relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border transition-colors',
                        'hover:border-ring hover:bg-muted/50',
                        displayError ? 'border-destructive' : 'border-input',
                    )}
                >
                    {displayUrl ? (
                        <>
                            <img
                                src={displayUrl}
                                alt="Logo"
                                className="size-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <CameraIcon className="size-3 text-white" />
                            </div>
                        </>
                    ) : (
                        fallback || <CameraIcon className="text-muted-foreground size-4" />
                    )}
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                />

                {displayError && (
                    <p className="text-destructive mt-1 text-xs">{displayError}</p>
                )}
            </div>
        );
    }

    return (
        <div className={cn('space-y-2', className)}>
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                }}
                className={cn(
                    'relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-8 transition-colors',
                    'hover:border-ring hover:bg-muted/50',
                    displayError ? 'border-destructive' : 'border-input',
                )}
            >
                {displayUrl ? (
                    <div>
                        <img
                            src={displayUrl}
                            alt="Preview"
                            className="max-h-24 max-w-48 rounded-md object-contain"
                        />
                    </div>
                ) : (
                    <>
                        <CameraIcon className="text-muted-foreground mb-2 size-8" />
                        <p className="text-muted-foreground text-sm">
                            Drag & drop or click to upload
                        </p>
                        <p className="text-muted-foreground/70 mt-1 text-xs">
                            Max {(maxSize / 1024 / 1024).toFixed(0)}MB
                        </p>
                    </>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                />
            </div>

            {displayError && (
                <p className="text-destructive text-sm">{displayError}</p>
            )}
        </div>
    );
}

export { FileUpload };
export type { FileUploadProps };
