import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { getAllTransports } from "../../hooks/transportation/transportation";

interface Transport {
  _id: string;
  title: string;
  description: string;
  country: string;
  type: string;
  images: string[];
  countryV2: {
    _id: string;
    country: string;
  };
  typeV2: {
    _id: string;
    transportType: string;
  };
}

interface SearchableDropdownProps {
  disabled: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
}

const SearchableTransportDropdown = ({
  disabled,
  title,
  value,
  onChange,
  placeholder = `Search ${title.toLowerCase()}...`,
}: SearchableDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transports, setTransports] = useState<Transport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  const getDisplayName = (transport: Transport): string => {
    return `${transport.title} (${transport.country} - ${transport.type})`;
  };

  useEffect(() => {
    const initializeTransport = async () => {
      if (value && value.trim() !== "") {
        try {
          const { transports: allTransports } = await getAllTransports("");
          const transport = allTransports.find(
            (t: Transport) => t._id === value
          );
          if (transport) {
            setSearchTerm(getDisplayName(transport));
          }
        } catch (error) {
          console.error("Error initializing transport:", error);
        }
      }
    };

    initializeTransport();
  }, [value]);

  const fetchTransports = useCallback(async (search: string) => {
    try {
      if (!isInitialMount.current) {
        setIsLoading(true);
      }

      const { transports } = await getAllTransports(search);
      setTransports(transports);
    } catch (error) {
      console.error("Error fetching transports:", error);
      setTransports([]);
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
      fetchTransports(newSearchTerm);
    }, 300);

    if (!newSearchTerm.trim() && value) {
      onChange("");
    }
  };

  const handleTransportSelect = (transport: Transport) => {
    setSearchTerm(getDisplayName(transport));
    onChange(transport._id);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && transports.length === 0) {
      fetchTransports("");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(true); // Keep it open to show all results
    fetchTransports(""); // Fetch all transports when clearing
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

        {isOpen && transports.length > 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {transports.map((transport) => (
              <div
                key={transport._id}
                onClick={() => handleTransportSelect(transport)}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-black/6 last:border-b-0 ${
                  transport._id === value ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-xs font-medium capitalize">
                  {transport.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {transport.country} • {transport.type}
                </div>
                {transport.description && (
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {transport.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isOpen && !isLoading && transports.length === 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 p-4">
            <div className="text-xs text-gray-500 text-center">
              {searchTerm
                ? `No transports found matching "${searchTerm}"`
                : "No transports available"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableTransportDropdown;
