import { type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { useState, useEffect } from "react";
import { RiCloseLine, RiLoader4Line, RiImageLine } from "react-icons/ri";

interface Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error: string | undefined;
  initialFiles?: File[];
  disabled: boolean;
  title: string;
}

const CarouselInput = ({
  title,
  disabled,
  setValue,
  error,
  initialFiles = [],
}: Props) => {
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files);
    if (validFiles.length === 0) return;

    setIsProcessing(true);

    try {
      const processedFiles = await Promise.all(
        validFiles.map((file) => convertToWebP(file)),
      );

      const newUrls = processedFiles.map((file) => URL.createObjectURL(file));
      const updatedFiles = [...previewFiles, ...processedFiles];
      const updatedUrls = [...previewUrls, ...newUrls];

      setPreviewFiles(updatedFiles);
      setPreviewUrls(updatedUrls);

      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      setValue("carousel", dataTransfer.files, { shouldValidate: true });
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setIsProcessing(false);
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

    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((file) => dataTransfer.items.add(file));
    setValue("carousel", dataTransfer.files, { shouldValidate: true });
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  useEffect(() => {
    if (initialFiles.length > 0) {
      const processInitial = async () => {
        setIsProcessing(true);
        try {
          const processed = await Promise.all(
            initialFiles.map((file) => convertToWebP(file)),
          );
          const urls = processed.map((file) => URL.createObjectURL(file));
          setPreviewFiles(processed);
          setPreviewUrls(urls);

          const dataTransfer = new DataTransfer();
          processed.forEach((file) => dataTransfer.items.add(file));
          setValue("carousel", dataTransfer.files, { shouldValidate: true });
        } catch (error) {
          console.error("Error processing initial images:", error);
        } finally {
          setIsProcessing(false);
        }
      };
      processInitial();
    }
  }, [initialFiles, setValue]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-sm font-semibold capitalize">{title}</p>

      <div className="relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm font-normal px-6 py-3 bg-white rounded-full w-full"
          disabled={disabled || isProcessing}
        />

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
            <RiLoader4Line size={20} className="animate-spin text-[#1d2087]" />
            <span className="text-xs ml-2 text-gray-600">Processing...</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative">
            {imageErrors.has(index) ? (
              <div className="w-50 h-50 bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                <RiImageLine size={32} className="text-gray-400" />
                <p className="text-sm text-gray-500">Image not found</p>
              </div>
            ) : (
              <img
                src={url}
                alt={`preview-${index}`}
                className="w-50 h-50 object-cover object-center rounded-2xl"
                onError={() => handleImageError(index)}
              />
            )}
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

        {isProcessing && previewUrls.length === 0 && (
          <div className="w-50 h-50 rounded-2xl bg-gray-100 flex items-center justify-center">
            <RiLoader4Line size={32} className="animate-spin text-[#1d2087]" />
          </div>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default CarouselInput;
