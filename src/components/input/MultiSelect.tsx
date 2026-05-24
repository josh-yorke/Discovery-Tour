import { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine, RiCloseFill } from "react-icons/ri";

interface MultiSelectProps {
  title?: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const MultiSelect = ({
  title,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
  disabled = false,
  error = "",
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
    setSearchTerm("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  const selectedLabels = selectedValues
    .map((v) => options.find((opt) => opt.value === v)?.label)
    .filter(Boolean);

  return (
    <div
      className="w-full flex flex-col items-start justify-center gap-2"
      ref={dropdownRef}
    >
      {title && <p className="text-sm font-semibold">{title}</p>}

      <div
        className={`w-full relative ${error ? "border border-red-500 rounded-full" : ""}`}
      >
        <div
          onClick={handleToggle}
          className={`w-full px-4 py-2.5 rounded-full bg-white flex items-center justify-between cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"
          }`}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-[#1d2087] text-white text-xs px-2 py-1 rounded-full"
                >
                  {label}
                  {!disabled && (
                    <RiCloseFill
                      size={14}
                      className="cursor-pointer hover:text-gray-200"
                      onClick={(e) => handleRemove(selectedValues[idx], e)}
                    />
                  )}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs">{placeholder}</span>
            )}
          </div>
          <RiArrowDropDownLine
            size={20}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="sticky top-0 bg-white p-2 border-b border-black/6">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 text-xs rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1d2087]"
              />
            </div>
            <div className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-black/6 last:border-b-0 ${
                      selectedValues.includes(option.value) ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        readOnly
                        className="w-4 h-4 text-[#1d2087] rounded border-gray-300"
                      />
                      <span className="text-xs font-normal">
                        {option.label}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-gray-500 text-center">
                  No options found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelect;
