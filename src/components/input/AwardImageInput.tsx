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
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (initialFiles.length > 0) {
      const urls = initialFiles.map((file) => URL.createObjectURL(file));
      setPreviewFiles(initialFiles);
      setPreviewUrls(urls);

      const dataTransfer = new DataTransfer();
      initialFiles.forEach((file) => dataTransfer.items.add(file));
      setValue(name, dataTransfer.files, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [initialFiles, setValue, name]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedPattern = /^[a-zA-Z0-9._-]+$/;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      const fileName = file.name;
      const baseName =
        fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
      if (allowedPattern.test(baseName)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(fileName);
      }
    });

    if (invalidFiles.length > 0) {
      alert(
        `The following files were not added because they contain special characters:\n\n${invalidFiles.join(
          "\n"
        )}\n\nOnly letters, numbers, underscores (_), hyphens (-), and dots (.) are allowed.`
      );
    }

    if (validFiles.length === 0) return;

    // Create new arrays with the selected files (don't append to existing)
    const newUrls = validFiles.map((file) => URL.createObjectURL(file));

    // Set the new files (replace existing ones)
    setPreviewFiles(validFiles);
    setPreviewUrls(newUrls);

    // Create DataTransfer with ONLY the new files
    const dataTransfer = new DataTransfer();
    validFiles.forEach((file) => dataTransfer.items.add(file));

    console.log("Setting files to form:", validFiles.length, "files");
    setValue(name, dataTransfer.files, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Clean up previous URLs if any
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
  };

  const handleRemove = (index: number) => {
    const updatedFiles = previewFiles.filter((_, i) => i !== index);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);

    setPreviewFiles(updatedFiles);
    setPreviewUrls(updatedUrls);

    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((file) => dataTransfer.items.add(file));
    setValue(name, dataTransfer.files, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Clean up the removed URL
    URL.revokeObjectURL(previewUrls[index]);
  };

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-sm font-semibold capitalize">{title}</p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="text-sm font-normal px-6 py-3 bg-white rounded-lg"
        disabled={disabled}
      />

      {previewFiles.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Selected files: {previewFiles.length}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`preview-${index}`}
              className="w-[200px] h-[200px] object-cover object-center rounded-2xl"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-4 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                <RiCloseLine size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default AwardImageInput;
