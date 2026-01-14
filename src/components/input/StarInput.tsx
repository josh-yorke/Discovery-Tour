import type { ChangeEvent, FormEvent } from "react";

interface InputData {
  title: string;
  type: string;
  placeholder: string;
  error: string | undefined;
  disabled: boolean;
  style: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
}

const StarInput = ({
  disabled,
  title,
  type,
  placeholder,
  error,
  style,
  onChange,
  value,
  ...props
}: InputData) => {
  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    if (type !== "number") return;

    const input = e.currentTarget;
    const inputValue = input.value;

    // If empty, allow it
    if (inputValue === "") return;

    // Check if it's a valid number 1-5
    const numValue = parseInt(inputValue, 10);

    // If invalid or out of range, revert to previous value
    if (isNaN(numValue) || numValue < 1 || numValue > 5) {
      // Reset to the last valid value or empty
      input.value = value?.toString() || "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const inputValue = e.target.value;

    if (type === "number") {
      // Allow empty input
      if (inputValue === "") {
        onChange(e);
        return;
      }

      // Parse and validate
      const numValue = parseInt(inputValue, 10);

      if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
        onChange(e);
      }
      // If invalid, don't call onChange - the input will be reset by handleInput
    } else {
      onChange(e);
    }
  };

  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 text-sm">
      <p className="font-semibold capitalize">{title}</p>
      <input
        type={type}
        className={`w-full px-6 py-3 outline-none rounded-full font-normal ${style}`}
        placeholder={placeholder}
        max={5}
        min={1}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        onInput={handleInput} // Add this!
        {...props}
      />
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default StarInput;
