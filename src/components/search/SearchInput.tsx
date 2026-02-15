import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const SearchInput = ({
  placeholder,
  className,
  ...props
}: SearchInputProps) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full px-6 py-3.5 rounded-full bg-white text-sm ${className || ""}`}
        {...props}
      />
    </div>
  );
};

export default SearchInput;
