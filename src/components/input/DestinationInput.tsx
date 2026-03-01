import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { getVisaCountriesId } from "../../hooks/visa/visa/getVisas";

interface Country {
  _id: string;
  country: string;
  savedAt: string;
  __v: number;
}

interface DestinationInputProps {
  disabled: boolean;
  title: string;
  value: string; // Single country ID
  onChange: (destination: string) => void;
  placeholder?: string;
  error?: string;
}

const DestinationInput = ({
  disabled,
  title,
  value,
  onChange,
  placeholder = "Select a destination...",
  error,
}: DestinationInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const data = await getVisaCountriesId();
        setCountries(data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Set initial search term if value exists
  useEffect(() => {
    if (value) {
      const selectedCountry = countries.find((c) => c._id === value);
      if (selectedCountry) {
        setSearchTerm(selectedCountry.country);
      }
    }
  }, [value, countries]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    // Clear selection when user types
    if (value) {
      onChange("");
    }
  };

  const handleSelectDestination = (countryId: string, countryName: string) => {
    setSearchTerm(countryName);
    onChange(countryId);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (
      e.key === "Enter" &&
      searchTerm.trim() &&
      filteredCountries.length > 0
    ) {
      e.preventDefault();
      const firstMatch = filteredCountries[0];
      handleSelectDestination(firstMatch._id, firstMatch.country);
    }
  };

  const filteredCountries = countries.filter((country) => {
    if (!country?.country) return false;
    return country.country.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
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

        {isOpen && filteredCountries.length > 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredCountries.map((country) => (
              <div
                key={country._id}
                onClick={() =>
                  handleSelectDestination(country._id, country.country)
                }
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-black/6 last:border-b-0 ${
                  country._id === value ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-xs font-medium capitalize">
                  {country.country}
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen &&
          !isLoading &&
          filteredCountries.length === 0 &&
          searchTerm && (
            <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 p-4">
              <div className="text-xs text-gray-500 text-center">
                No countries found matching "{searchTerm}"
              </div>
            </div>
          )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default DestinationInput;
