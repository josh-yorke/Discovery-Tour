import { type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { useState, useEffect } from "react";
import { RiCloseLine, RiLoader4Line, RiImageLine } from "react-icons/ri";

interface Props {
  name: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error: string | undefined;
  initialFiles?: File[];
  disabled: boolean;
  title: string;
}

const AwardImageInput = ({
  name,
  title,
  disabled,
  setValue,
  error,
  initialFiles = [],
}: Props) => {
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageError, setImageError] = useState(false);
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

  useEffect(() => {
    if (initialFiles.length > 0) {
      const processInitial = async () => {
        setIsProcessing(true);
        try {
          const file = initialFiles[0];
          const processedFile = await convertToWebP(file);
          const url = URL.createObjectURL(processedFile);
          setPreviewFile(processedFile);
          setPreviewUrl(url);
          setImageError(false);

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(processedFile);
          setValue(name, dataTransfer.files, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } catch (error) {
          console.error("Error processing initial image:", error);
        } finally {
          setIsProcessing(false);
        }
      };
      processInitial();
    }
  }, [initialFiles, setValue, name]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileName = file.name;
    const baseName =
      fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const allowedPattern = /^[a-zA-Z0-9._-]+$/;

    if (!allowedPattern.test(baseName)) {
      alert(
        `The file "${fileName}" was not added because it contains special characters.\n\nOnly letters, numbers, underscores (_), hyphens (-), and dots (.) are allowed.`,
      );
      return;
    }

    setIsProcessing(true);
    setImageError(false);

    try {
      // Clean up previous URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const processedFile = await convertToWebP(file);
      const newUrl = URL.createObjectURL(processedFile);
      setPreviewFile(processedFile);
      setPreviewUrl(newUrl);

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(processedFile);

      setValue(name, dataTransfer.files, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewFile(null);
    setPreviewUrl("");
    setImageError(false);

    const dataTransfer = new DataTransfer();
    setValue(name, dataTransfer.files, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-sm font-semibold capitalize">{title}</p>

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm font-normal px-6 py-3 bg-white rounded-lg w-full"
          disabled={disabled || isProcessing}
        />

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
            <RiLoader4Line size={20} className="animate-spin text-[#1d2087]" />
            <span className="text-xs ml-2 text-gray-600">Processing...</span>
          </div>
        )}
      </div>

      {previewFile && !isProcessing && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Selected file: {previewFile.name}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-4">
        {previewUrl && (
          <div className="relative">
            {imageError ? (
              <div className="w-50 h-50 bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                <RiImageLine size={32} className="text-gray-400" />
                <p className="text-sm text-gray-500">Image not found</p>
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                className="w-50 h-50 object-cover object-center rounded-2xl"
                onError={handleImageError}
              />
            )}
            {!disabled && !isProcessing && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-4 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <RiCloseLine size={16} />
              </button>
            )}
          </div>
        )}

        {isProcessing && !previewUrl && (
          <div className="w-50 h-50 rounded-2xl bg-gray-100 flex items-center justify-center">
            <RiLoader4Line size={32} className="animate-spin text-[#1d2087]" />
          </div>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default AwardImageInput;
