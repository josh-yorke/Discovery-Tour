import { type UseFormSetValue } from "react-hook-form";
import { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";

interface Props {
  setValue: UseFormSetValue<any>;
  error: string | undefined;
  initialFile?: File | null;
  disabled: boolean;
  title: string;
  onChange?: (files: FileList | null) => void;
}

const FileInput = ({
  title,
  disabled,
  setValue,
  error,
  initialFile = null,
  onChange,
}: Props) => {
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (initialFile) {
      const url = URL.createObjectURL(initialFile);
      setPreviewFile(initialFile);
      setPreviewUrl(url);

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(initialFile);
      setValue("file", dataTransfer.files);
    }
  }, [initialFile, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newUrl = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(newUrl);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    setValue("file", dataTransfer.files);

    if (onChange) {
      onChange(files);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewFile(null);
    setPreviewUrl("");

    const dataTransfer = new DataTransfer();
    setValue("file", dataTransfer.files);

    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-sm font-semibold capitalize">{title}</p>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="text-sm font-normal px-6 py-3 bg-white rounded-lg"
        disabled={disabled}
      />

      {previewUrl && previewFile && (
        <div className="mt-4">
          <div className="relative inline-block">
            {previewFile.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-50 h-50 object-cover object-center rounded-2xl"
              />
            ) : (
              <div className="w-50 h-50 bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-xs text-center px-2 break-all">
                  {previewFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {previewFile.type || "Unknown type"}
                </p>
              </div>
            )}
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
        </div>
      )}

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default FileInput;
