import { type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { RiCloseLine, RiLoader4Line, RiImageLine } from "react-icons/ri";

interface Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error: string | undefined;
  initialFiles?: File[];
  disabled: boolean;
  title: string;
  fieldName?: string;
  onFileSelect?: (files: File[]) => void;
  maxImages?: number;
}

const CustomImageInput = ({
  title,
  disabled,
  setValue,
  error,
  initialFiles = [],
  fieldName = "images",
  onFileSelect,
  maxImages = 1,
}: Props) => {
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, ".webp"),
                  {
                    type: "image/webp",
                  },
                );
                resolve(webpFile);
              } else {
                reject(new Error("Conversion failed"));
              }
            },
            "image/webp",
            0.8,
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const processFiles = async (files: File[], existingFiles: File[] = []) => {
    const totalFiles = existingFiles.length + files.length;

    if (totalFiles > maxImages) {
      alert(
        `You can only upload up to ${maxImages} images. You currently have ${existingFiles.length} images and trying to add ${files.length} more.`,
      );
      return existingFiles;
    }

    setIsProcessing(true);
    try {
      const processedFiles = await Promise.all(
        files.map((file) => convertToWebP(file)),
      );

      const updatedFiles = [...existingFiles, ...processedFiles];
      const newUrls = processedFiles.map((file) => URL.createObjectURL(file));
      const updatedUrls = [...previewUrls, ...newUrls];

      setPreviewFiles(updatedFiles);
      setPreviewUrls(updatedUrls);

      setValue(fieldName, updatedFiles, { shouldValidate: true });

      if (onFileSelect) {
        onFileSelect(updatedFiles);
      }

      return updatedFiles;
    } catch (error) {
      console.error("Error processing images:", error);
      return existingFiles;
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    const initializeFiles = async () => {
      if (initialFiles.length > 0 && !hasInitialized.current) {
        if (initialFiles.length > maxImages) {
          console.warn(
            `Initial files (${initialFiles.length}) exceed max limit (${maxImages})`,
          );
          return;
        }

        setIsProcessing(true);
        try {
          const processed = await Promise.all(
            initialFiles.map((file) => convertToWebP(file)),
          );

          const urls = processed.map((file) => URL.createObjectURL(file));
          setPreviewFiles(processed);
          setPreviewUrls(urls);
          setValue(fieldName, processed, { shouldValidate: true });

          if (onFileSelect) {
            onFileSelect(processed);
          }

          hasInitialized.current = true;
        } catch (error) {
          console.error("Error processing initial files:", error);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    initializeFiles();
  }, [initialFiles, fieldName, setValue, onFileSelect, maxImages]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = Array.from(files);
    if (validFiles.length === 0) return;

    await processFiles(validFiles, previewFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);

    const updatedFiles = [...previewFiles];
    const updatedUrls = [...previewUrls];

    updatedFiles.splice(index, 1);
    updatedUrls.splice(index, 1);

    setPreviewFiles(updatedFiles);
    setPreviewUrls(updatedUrls);

    setValue(fieldName, updatedFiles.length > 0 ? updatedFiles : undefined, {
      shouldValidate: true,
    });

    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold capitalize">{title}</p>
        <p className="text-xs text-gray-500">
          {previewFiles.length} / {maxImages} images
        </p>
      </div>

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm font-normal px-6 py-3 bg-white rounded-full w-full"
          disabled={
            disabled || isProcessing || previewFiles.length >= maxImages
          }
        />

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
            <RiLoader4Line size={20} className="animate-spin text-[#1d2087]" />
            <span className="text-xs ml-2 text-gray-600">
              Converting to WebP...
            </span>
          </div>
        )}
      </div>

      {previewFiles.length >= maxImages && (
        <p className="text-xs text-yellow-600">
          Maximum {maxImages} images reached
        </p>
      )}

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative w-full">
              {imageErrors.has(index) ? (
                <div className="w-full aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <RiImageLine size={32} className="text-gray-400" />
                  <p className="text-sm text-gray-500">Image not found</p>
                </div>
              ) : (
                <img
                  src={url}
                  alt={`preview-${index}`}
                  className="w-full aspect-video object-cover rounded-2xl"
                  onError={() => handleImageError(index)}
                />
              )}
              {!disabled && !isProcessing && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <RiCloseLine size={14} />
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
