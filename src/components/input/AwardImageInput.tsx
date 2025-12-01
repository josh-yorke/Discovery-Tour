import { type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";

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

  useEffect(() => {
    if (initialFiles.length > 0) {
      // Take only the first file if multiple are provided
      const file = initialFiles[0];
      const url = URL.createObjectURL(file);
      setPreviewFile(file);
      setPreviewUrl(url);

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue(name, dataTransfer.files, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [initialFiles, setValue, name]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Take only the first file
    const file = files[0];
    const fileName = file.name;
    const baseName =
      fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const allowedPattern = /^[a-zA-Z0-9._-]+$/;

    if (!allowedPattern.test(baseName)) {
      alert(
        `The file "${fileName}" was not added because it contains special characters.\n\nOnly letters, numbers, underscores (_), hyphens (-), and dots (.) are allowed.`
      );
      return;
    }

    // Clean up previous URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newUrl = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(newUrl);

    // Create DataTransfer with only the selected file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    console.log("Setting file to form:", file.name);
    setValue(name, dataTransfer.files, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemove = () => {
    // Clean up the URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewFile(null);
    setPreviewUrl("");

    // Set empty file list
    const dataTransfer = new DataTransfer();
    setValue(name, dataTransfer.files, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Clean up URL on unmount
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
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="text-sm font-normal px-6 py-3 bg-white rounded-lg"
        disabled={disabled}
      />

      {previewFile && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Selected file: {previewFile.name}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-4">
        {previewUrl && (
          <div className="relative">
            <img
              src={previewUrl}
              alt="preview"
              className="w-[200px] h-[200px] object-cover object-center rounded-2xl"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-4 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                <RiCloseLine size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default AwardImageInput;
