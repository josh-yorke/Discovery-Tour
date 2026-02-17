import { useState, useEffect } from "react";

interface DestinationsInputProps {
  disabled: boolean;
  title: string;
  value: string[];
  onChange: (destinations: string[]) => void;
  placeholder: string;
  error?: string;
  style?: string;
}

const DestinationsInput = ({
  disabled,
  title,
  value,
  onChange,
  placeholder,
  error,
  style = "bg-white",
}: DestinationsInputProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value.length === 0) {
      setInputValue("");
    }
  }, [value]);

  const handleAddDestination = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveDestination = (destinationToRemove: string) => {
    onChange(value.filter((dest) => dest !== destinationToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDestination();
    }
  };

  return (
    <div className="w-full flex flex-col items-start justify-center gap-2">
      <p className="text-sm font-semibold">{title}</p>

      <div className="w-full flex gap-2">
        <div
          className={`flex-1 px-4 py-2.5 rounded-full ${style} ${error ? "border border-red-500" : ""}`}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={placeholder}
            className="text-xs font-normal outline-none w-full bg-transparent"
          />
        </div>

        <button
          type="button"
          onClick={handleAddDestination}
          disabled={disabled || !inputValue.trim()}
          className="px-6 py-2.5 bg-[#1d2087] text-white rounded-full hover:bg-[#3b3eac] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-xs font-medium whitespace-nowrap"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((destination, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-200 px-4 py-1.5 rounded-full"
            >
              <span className="text-xs font-normal text-gray-700">
                {destination}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveDestination(destination)}
                disabled={disabled}
                className="text-gray-500 hover:text-red-600 font-bold text-base leading-none transition-colors duration-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default DestinationsInput;
