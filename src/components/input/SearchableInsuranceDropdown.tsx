import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { getAllInsurances } from "../../hooks/insurances/insurance";

interface Insurance {
  _id: string;
  title: string;
  insurancePartner: string;
  country: string;
  description: string;
  images: string[];
  countryV2?: {
    country: string;
  };
  insurancePartnerV2?: {
    name: string;
  };
}

interface SearchableInsuranceDropdownProps {
  disabled: boolean;
  title: string;
  value: string;
  onChange: (insuranceId: string) => void;
  placeholder?: string;
  error?: string;
}

const SearchableInsuranceDropdown = ({
  disabled,
  title,
  value,
  onChange,
  placeholder = `Search ${title.toLowerCase()}...`,
  error,
}: SearchableInsuranceDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  const getDisplayName = (insurance: Insurance): string => {
    const partner =
      insurance.insurancePartnerV2?.name || insurance.insurancePartner;
    const country = insurance.countryV2?.country || insurance.country;
    return `${insurance.title} - ${partner} (${country})`;
  };

  // Initialize with value from props
  useEffect(() => {
    const initializeInsurance = async () => {
      if (value && value.trim() !== "") {
        try {
          const data = await getAllInsurances();
          const insurancesList = data.insurances || [];
          const insurance = insurancesList.find(
            (i: Insurance) => i._id === value,
          );
          if (insurance) {
            setSearchTerm(getDisplayName(insurance));
          }
        } catch (error) {
          console.error("Error initializing insurance:", error);
        }
      }
    };

    initializeInsurance();
  }, [value]);

  const fetchInsurances = useCallback(async (search: string) => {
    try {
      if (!isInitialMount.current) {
        setIsLoading(true);
      }

      const data = await getAllInsurances();
      const insurancesList = data.insurances || [];

      let filtered = insurancesList;
      if (search.trim()) {
        filtered = insurancesList.filter(
          (insurance: Insurance) =>
            insurance.title.toLowerCase().includes(search.toLowerCase()) ||
            (insurance.insurancePartnerV2?.name || insurance.insurancePartner)
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (insurance.countryV2?.country || insurance.country)
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            insurance.description?.toLowerCase().includes(search.toLowerCase()),
        );
      }

      setInsurances(filtered);
    } catch (error) {
      console.error("Error fetching insurances:", error);
      setInsurances([]);
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
      fetchInsurances(newSearchTerm);
    }, 300);

    if (!newSearchTerm.trim() && value) {
      onChange("");
    }
  };

  const handleInsuranceSelect = (insurance: Insurance) => {
    setSearchTerm(getDisplayName(insurance));
    onChange(insurance._id);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && insurances.length === 0) {
      fetchInsurances("");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(true);
    fetchInsurances("");
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
      <div
        className={`w-full px-4 py-2.5 rounded-full relative bg-white ${
          error ? "border border-red-500" : ""
        }`}
      >
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

        {isOpen && insurances.length > 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {insurances.map((insurance) => {
              const partner =
                insurance.insurancePartnerV2?.name ||
                insurance.insurancePartner;
              const country = insurance.countryV2?.country || insurance.country;

              return (
                <div
                  key={insurance._id}
                  onClick={() => handleInsuranceSelect(insurance)}
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-black/6 last:border-b-0 ${
                    insurance._id === value ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="text-xs font-medium capitalize">
                    {insurance.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Partner: {partner} • Country: {country}
                  </div>
                  {insurance.description && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {insurance.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isOpen && !isLoading && insurances.length === 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 p-4">
            <div className="text-xs text-gray-500 text-center">
              {searchTerm
                ? `No insurances found matching "${searchTerm}"`
                : "No insurances available"}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default SearchableInsuranceDropdown;
