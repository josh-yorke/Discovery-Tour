import { type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { RiCloseLine } from "react-icons/ri";

interface Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error: string | undefined;
  initialFiles?: File[];
  disabled: boolean;
  title: string;
  fieldName?: string;
  onFileSelect?: (files: File[]) => void;
}

const CustomImageInput = ({
  title,
  disabled,
  setValue,
  error,
  initialFiles = [],
  fieldName = "images",
  onFileSelect,
}: Props) => {
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Set initial files only once
  useEffect(() => {
    if (initialFiles.length > 0 && !hasInitialized.current) {
      const urls = initialFiles.map((file) => URL.createObjectURL(file));
      setPreviewFiles([...initialFiles]);
      setPreviewUrls(urls);
      hasInitialized.current = true;

      // Set form value
      setValue(fieldName, initialFiles, { shouldValidate: true });

      // Notify parent
      if (onFileSelect) {
        onFileSelect(initialFiles);
      }
    }
  }, [initialFiles, fieldName, setValue, onFileSelect]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Simplified: Accept all files regardless of special characters
    const validFiles: File[] = Array.from(files);

    if (validFiles.length === 0) return;

    // Create object URLs for new files
    const newUrls = validFiles.map((file) => URL.createObjectURL(file));

    // Combine with existing files
    const updatedFiles = [...previewFiles, ...validFiles];
    const updatedUrls = [...previewUrls, ...newUrls];

    setPreviewFiles(updatedFiles);
    setPreviewUrls(updatedUrls);

    // Update form value
    setValue(fieldName, updatedFiles, { shouldValidate: true });

    // Notify parent
    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    // Revoke the object URL for the removed image
    URL.revokeObjectURL(previewUrls[index]);

    const updatedFiles = [...previewFiles];
    const updatedUrls = [...previewUrls];

    updatedFiles.splice(index, 1);
    updatedUrls.splice(index, 1);

    setPreviewFiles(updatedFiles);
    setPreviewUrls(updatedUrls);

    // Update form value
    setValue(fieldName, updatedFiles.length > 0 ? updatedFiles : undefined, {
      shouldValidate: true,
    });

    // Notify parent
    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-sm font-semibold capitalize">{title}</p>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="text-sm font-normal px-6 py-3 bg-white rounded-full"
        disabled={disabled}
      />

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`preview-${index}`}
                className="w-50 h-50 object-cover object-center rounded-3xl"
                onError={(e) => {
                  console.error("Failed to load image:", url);
                  e.currentTarget.style.display = "none";
                }}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-4 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <RiCloseLine size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default CustomImageInput;
