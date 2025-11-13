import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

export interface ImageUploadProps {
  onImageChange: (file: File | null, preview: string | null) => void;
  initialPreview?: string | null;
  label?: string;
}

export default function ImageUpload({ onImageChange, initialPreview = null, label }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageChange(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-gray-800">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Haz clic para subir una imagen
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
