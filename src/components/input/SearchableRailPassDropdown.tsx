import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { getAllRailPasses } from "../../hooks/rail-passes/getRailPasses";

interface RailPass {
  _id: string;
  title: string;
  description: string;
  country: string;
  category: string;
  type: string;
  images: string[];
  countryV2: {
    _id: string;
    country: string;
  };
  typeV2: {
    _id: string;
    railPassType: string;
  };
  categoryV2: {
    _id: string;
    railPassCategory: string;
  };
}

interface SearchableDropdownProps {
  disabled: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  error?: string;
}

const SearchableRailPassDropdown = ({
  disabled,
  title,
  value,
  onChange,
  placeholder = `Search ${title.toLowerCase()}...`,
  error,
}: SearchableDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [railPasses, setRailPasses] = useState<RailPass[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  const getDisplayName = (railPass: RailPass): string => {
    return `${railPass.title} (${railPass.country} - ${railPass.type} - ${railPass.category})`;
  };

  useEffect(() => {
    const initializeRailPass = async () => {
      if (value && value.trim() !== "") {
        try {
          const { railPasses: allRailPasses } = await getAllRailPasses("");
          const railPass = allRailPasses.find((r: RailPass) => r._id === value);
          if (railPass) {
            setSearchTerm(getDisplayName(railPass));
          }
        } catch (error) {
          console.error("Error initializing rail pass:", error);
        }
      }
    };

    initializeRailPass();
  }, [value]);

  const fetchRailPasses = useCallback(async (search: string) => {
    try {
      if (!isInitialMount.current) {
        setIsLoading(true);
      }

      const { railPasses } = await getAllRailPasses(search);
      setRailPasses(railPasses);
    } catch (error) {
      console.error("Error fetching rail passes:", error);
      setRailPasses([]);
    } finally {
      setIsLoading(false);
      isInitialMount.current = false;
    }
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      fetchRailPasses(newSearchTerm);
    }, 300);

    if (!newSearchTerm.trim() && value) {
      onChange("");
    }
  };

  const handleRailPassSelect = (railPass: RailPass) => {
    setSearchTerm(getDisplayName(railPass));
    onChange(railPass._id);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && railPasses.length === 0) {
      fetchRailPasses("");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(true);
    fetchRailPasses("");
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "Enter" && searchTerm.trim() === "" && value) {
      handleClear();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="w-full flex flex-col items-start justify-center gap-2"
      ref={dropdownRef}
    >
      <p className="text-sm font-semibold">{title}</p>
      <div className="w-full px-4 py-2.5 rounded-full relative bg-white">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full text-xs font-normal outline-none capitalize bg-transparent disabled:opacity-50 pr-8"
        />

        {searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Clear selection"
          >
            ✕
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b border-black/6"></div>
          </div>
        )}

        {isOpen && railPasses.length > 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {railPasses.map((railPass) => (
              <div
                key={railPass._id}
                onClick={() => handleRailPassSelect(railPass)}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-black/6 last:border-b-0 ${
                  railPass._id === value ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-xs font-medium capitalize">
                  {railPass.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {railPass.country} • {railPass.type} • {railPass.category}
                </div>
                {railPass.description && (
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {railPass.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isOpen && !isLoading && railPasses.length === 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 p-4">
            <div className="text-xs text-gray-500 text-center">
              {searchTerm
                ? `No rail passes found matching "${searchTerm}"`
                : "No rail passes available"}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default SearchableRailPassDropdown;
