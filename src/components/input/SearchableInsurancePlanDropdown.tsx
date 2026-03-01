import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { getInsurancePricelist } from "../../hooks/visa/pricelist/getPriceList";

interface InsurancePlan {
  _id: string;
  plan: string;
  fee: number;
  priceCurrency?: string;
  currency?: string;
  description: string;
  filesAssociated: string[];
  insuranceId: string;
  coverage?: string[];
  duration?: string;
  dateAdded: string;
  __v: number;
  insuranceV2?: {
    _id: string;
    title: string;
    insurancePartner: string;
    country: string;
  };
}

interface SearchableInsurancePlanDropdownProps {
  disabled: boolean;
  title: string;
  value: string;
  onChange: (planId: string) => void;
  insuranceId?: string;
  placeholder?: string;
  error?: string;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  KRW: "₩",
  JPY: "¥",
  PHP: "₱",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SAR: "﷼",
};

const SearchableInsurancePlanDropdown = ({
  disabled,
  title,
  value,
  onChange,
  insuranceId = "",
  placeholder = `Search ${title.toLowerCase()}...`,
  error,
}: SearchableInsurancePlanDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  const getDisplayName = (plan: InsurancePlan): string => {
    const currency = plan.priceCurrency || plan.currency || "USD";
    const symbol = currencySymbols[currency] || currency;
    const insuranceInfo = plan.insuranceV2
      ? ` - ${plan.insuranceV2.title} (${plan.insuranceV2.insurancePartner})`
      : "";

    let priceDisplay = "";
    if (plan.fee === 0 || plan.fee < 0.01) {
      priceDisplay = "Flexible";
    } else {
      priceDisplay = `${symbol}${plan.fee.toLocaleString()}`;
    }

    return `${plan.plan}${insuranceInfo} (${priceDisplay})`;
  };

  // Initialize with value from props
  useEffect(() => {
    const initializePlan = async () => {
      if (value && value.trim() !== "" && insuranceId) {
        setIsLoading(true);
        try {
          const pricelists = await getInsurancePricelist(insuranceId);
          const plan = pricelists.find((p: InsurancePlan) => p._id === value);
          if (plan) {
            setSearchTerm(getDisplayName(plan));
          }
        } catch (error) {
          console.error("Error initializing plan:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchTerm("");
      }
    };

    initializePlan();
  }, [value, insuranceId]);

  // Fetch plans when insuranceId changes
  useEffect(() => {
    if (insuranceId) {
      fetchPlans("");
    } else {
      setPlans([]);
      setSearchTerm("");
    }
  }, [insuranceId]);

  const fetchPlans = useCallback(
    async (search: string) => {
      if (!insuranceId) return;

      try {
        if (!isInitialMount.current) {
          setIsLoading(true);
        }

        const pricelists = await getInsurancePricelist(insuranceId);

        let filteredPlans = pricelists;
        if (search.trim()) {
          filteredPlans = pricelists.filter(
            (plan: InsurancePlan) =>
              plan.plan.toLowerCase().includes(search.toLowerCase()) ||
              plan.description?.toLowerCase().includes(search.toLowerCase()) ||
              plan.coverage?.some((c) =>
                c.toLowerCase().includes(search.toLowerCase()),
              ) ||
              plan.insuranceV2?.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              plan.insuranceV2?.insurancePartner
                .toLowerCase()
                .includes(search.toLowerCase()),
          );
        }

        setPlans(filteredPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlans([]);
      } finally {
        setIsLoading(false);
        isInitialMount.current = false;
      }
    },
    [insuranceId],
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      fetchPlans(newSearchTerm);
    }, 300);

    if (!newSearchTerm.trim() && value) {
      onChange("");
    }
  };

  const handlePlanSelect = (plan: InsurancePlan) => {
    setSearchTerm(getDisplayName(plan));
    onChange(plan._id);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && plans.length === 0 && insuranceId) {
      fetchPlans("");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    if (insuranceId) {
      fetchPlans("");
    }
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
          disabled={disabled || !insuranceId}
          placeholder={
            !insuranceId ? "Select an insurance policy first" : placeholder
          }
          className="w-full text-xs font-normal outline-none capitalize bg-transparent disabled:opacity-50 pr-8"
        />

        {searchTerm && !disabled && insuranceId && (
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

        {!insuranceId && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔒
          </div>
        )}

        {isOpen && plans.length > 0 && insuranceId && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {plans.map((plan) => {
              const currency = plan.priceCurrency || plan.currency || "USD";
              const symbol = currencySymbols[currency] || currency;

              return (
                <div
                  key={plan._id}
                  onClick={() => handlePlanSelect(plan)}
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-black/6 last:border-b-0 ${
                    plan._id === value ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-xs font-medium capitalize">
                      {plan.plan}
                    </div>
                    <div className="text-xs font-semibold text-blue-600">
                      {plan.fee === 0 || plan.fee < 0.01
                        ? "Flexible"
                        : `${symbol}${plan.fee.toLocaleString()}`}
                    </div>
                  </div>

                  {plan.insuranceV2 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Policy: {plan.insuranceV2.title} • Partner:{" "}
                      {plan.insuranceV2.insurancePartner} • Country:{" "}
                      {plan.insuranceV2.country}
                    </div>
                  )}

                  {plan.duration && (
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {plan.duration}
                    </div>
                  )}

                  {plan.coverage && plan.coverage.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Coverage: {plan.coverage.slice(0, 2).join(", ")}
                      {plan.coverage.length > 2 &&
                        ` +${plan.coverage.length - 2} more`}
                    </div>
                  )}

                  {plan.description && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {plan.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isOpen && !isLoading && plans.length === 0 && insuranceId && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 p-4">
            <div className="text-xs text-gray-500 text-center">
              {searchTerm
                ? `No plans found matching "${searchTerm}"`
                : "No plans available for this insurance policy"}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default SearchableInsurancePlanDropdown;
