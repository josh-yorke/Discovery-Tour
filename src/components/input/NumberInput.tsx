import React from "react";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "style"
> {
  title: string;
  type: string;
  placeholder: string;
  error: string | undefined;
  disabled: boolean;
  style: string;
}

const NumberInput = ({
  disabled,
  title,
  type,
  placeholder,
  error,
  style,
  onChange: propOnChange,
  onKeyDown: propOnKeyDown,
  ...props
}: InputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const numericValue = value.replace(/\D/g, "");

    if (value !== numericValue) {
      e.target.value = numericValue;
    }

    if (propOnChange) {
      propOnChange(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ].includes(e.key)
    ) {
      if (propOnKeyDown) propOnKeyDown(e);
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      if (["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) {
        if (propOnKeyDown) propOnKeyDown(e);
        return;
      }
    }

    if (!/\d/.test(e.key)) {
      e.preventDefault();
    } else if (propOnKeyDown) {
      propOnKeyDown(e);
    }
  };

  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 text-sm">
      <p className="font-semibold capitalize">{title}</p>
      <input
        type={type}
        className={`w-full px-6 py-3 outline-none rounded-full font-normal ${style}`}
        placeholder={placeholder}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        {...props}
        disabled={disabled}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default NumberInput;
