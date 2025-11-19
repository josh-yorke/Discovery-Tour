// components/input/FileInput.tsx
import React from "react";

// Define the specific setValue type that matches React Hook Form
type SetValueType = (name: "file", value: FileList | undefined) => void;

interface FileInputProps {
  title: string;
  disabled: boolean;
  setValue: SetValueType; // Use the specific type
  error?: string;
  onChange?: (files: FileList | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({
  title,
  disabled,
  setValue,
  error,
  onChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue("file", files);
      onChange?.(files);
    } else {
      setValue("file", undefined);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">{title}</label>
      <input
        type="file"
        accept=".pdf"
        disabled={disabled}
        onChange={handleFileChange}
        className="w-full bg-white text-sm px-6 py-3 rounded-lg"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FileInput;
