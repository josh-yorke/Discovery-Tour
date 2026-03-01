import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInsurances } from "../../hooks/insurances/insurance";

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

interface InsuranceFilterProps {
  value: string;
  onChange: (insuranceId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const InsuranceFilter = ({
  value,
  onChange,
  placeholder = "Search insurance policies...",
  disabled = false,
}: InsuranceFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: insurances, isLoading } = useQuery({
    queryKey: ["insurances", searchTerm],
    queryFn: () => getInsurances(1, searchTerm),
    enabled: (searchTerm.length > 0 || isOpen) && !disabled,
    staleTime: 300000,
  });

  useEffect(() => {
    const loadInsuranceDisplayName = async () => {
      if (!value?.trim()) {
        setDisplayText("");
        return;
      }

      try {
        const { insurances: allInsurances } = await getInsurances(1, "");
        const insurance = allInsurances.find((i: Insurance) => i._id === value);
        setDisplayText(
          insurance
            ? `${insurance.title} (${insurance.insurancePartner} - ${insurance.country})`
            : "",
        );
      } catch (error) {
        console.error("Error loading insurance:", error);
        setDisplayText("");
      }
    };

    if (!disabled) {
      loadInsuranceDisplayName();
    }
  }, [value, disabled]);

  const getDisplayName = (insurance: Insurance) =>
    `${insurance.title} (${insurance.insurancePartner} - ${insurance.country})`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setDisplayText(newSearchTerm);
    setIsOpen(true);
  };

  const handleInsuranceSelect = (insurance: Insurance) => {
    setDisplayText(getDisplayName(insurance));
    onChange(insurance._id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    setDisplayText("");
    onChange("");
    setSearchTerm("");
  };

  const handleInputFocus = () => setIsOpen(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown =
    isOpen && !isLoading && insurances?.insurances?.length > 0;

  return (
    <div className="w-full md:w-1/3 flex flex-col items-start justify-center gap-2">
      <div ref={containerRef} className="relative w-full">
        <div className="px-4 py-2.5 rounded-full bg-white">
          <input
            type="text"
            value={displayText}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full text-xs font-normal outline-none capitalize bg-transparent disabled:opacity-50"
          />

          {displayText && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}

          {isLoading && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            </div>
          )}
        </div>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200">
            {insurances?.insurances.map((insurance: Insurance) => (
              <div
                key={insurance._id}
                onClick={() => handleInsuranceSelect(insurance)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-900">
                  {insurance.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {insurance.insurancePartner} • {insurance.country}
                </div>
                {insurance.description && (
                  <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {insurance.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceFilter;
