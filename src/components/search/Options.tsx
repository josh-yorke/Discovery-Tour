import { useState, useRef, useEffect } from "react";

interface OptionProps {
  options: string[];
  title: string;
  allowShowAll?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  name?: string;
}

const Options = ({
  options,
  title,
  allowShowAll = true,
  value,
  onChange,
}: OptionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allOptions = allowShowAll ? ["All", ...options] : options;
  const displayValue = value === "" ? "All" : value || title;

  const handleSelect = (selectedValue: string) => {
    const syntheticEvent = {
      target: {
        value: selectedValue === "All" ? "" : selectedValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange?.(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex flex-row px-4 py-2.5 rounded-3xl bg-white items-center justify-center gap-2">
        <p className="text-xs font-semibold">{`${title}:`}</p>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white text-xs font-normal outline-none capitalize flex items-center justify-center cursor-pointer"
        >
          {displayValue}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-lg min-w-full max-h-60 overflow-y-auto z-50">
          {allOptions.map((option, index) => (
            <div
              key={option}
              className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-xs capitalize ${
                index === 0 ? "rounded-t-3xl" : ""
              } ${index === allOptions.length - 1 ? "rounded-b-3xl" : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Options;
