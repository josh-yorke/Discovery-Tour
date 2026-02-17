import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { getPassPricelists } from "../../hooks/visa/visa/getVisa";

interface RailPlan {
  _id: string;
  plan: string;
  fee: number;
  description: string;
  filesAssociated: any[];
  visa: any;
  tour: any;
  railpass: string;
  transport: any;
  vehicle: any;
  dateAdded: string;
  __v: number;
  railpassV2?: {
    _id: string;
    title: string;
    country: string;
    type: string;
    category: string;
  };
}

interface SearchableRailPlanDropdownProps {
  disabled: boolean;
  title: string;
  value: string;
  onChange: (planId: string) => void; // Rail plans don't have vehicles
  railPassId?: string;
  placeholder?: string;
  error?: string;
}

const SearchableRailPlanDropdown = ({
  disabled,
  title,
  value,
  onChange,
  railPassId = "",
  placeholder = `Search ${title.toLowerCase()}...`,
  error,
}: SearchableRailPlanDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plans, setPlans] = useState<RailPlan[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  const getDisplayName = (plan: RailPlan): string => {
    const railPassInfo = plan.railpassV2
      ? ` - ${plan.railpassV2.title} (${plan.railpassV2.country})`
      : "";
    return `${plan.plan}${railPassInfo} ($${plan.fee})`;
  };

  useEffect(() => {
    const initializePlan = async () => {
      if (value && value.trim() !== "" && railPassId) {
        try {
          const { pricelists } = await getPassPricelists(railPassId || "");
          const plan = pricelists.find((p: RailPlan) => p._id === value);
          if (plan) {
            setSearchTerm(getDisplayName(plan));
          }
        } catch (error) {
          console.error("Error initializing plan:", error);
        }
      }
    };

    initializePlan();
  }, [value, railPassId]);

  const fetchPlans = useCallback(
    async (search: string) => {
      try {
        if (!isInitialMount.current) {
          setIsLoading(true);
        }

        const { pricelists } = await getPassPricelists(railPassId || "");

        let filteredPlans = pricelists;
        if (search.trim()) {
          filteredPlans = pricelists.filter(
            (plan: RailPlan) =>
              plan.plan.toLowerCase().includes(search.toLowerCase()) ||
              plan.description?.toLowerCase().includes(search.toLowerCase()) ||
              plan.railpassV2?.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              plan.railpassV2?.country
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
    [railPassId],
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
      onChange(""); // Clear plan
    }
  };

  const handlePlanSelect = (plan: RailPlan) => {
    setSearchTerm(getDisplayName(plan));
    onChange(plan._id);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && plans.length === 0) {
      fetchPlans("");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange(""); // Clear plan
    setIsOpen(true);
    fetchPlans("");
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
          disabled={disabled || !railPassId}
          placeholder={!railPassId ? "Select a rail pass first" : placeholder}
          className="w-full text-xs font-normal outline-none capitalize bg-transparent disabled:opacity-50 pr-8"
        />

        {searchTerm && !disabled && railPassId && (
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

        {!railPassId && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔒
          </div>
        )}

        {isOpen && plans.length > 0 && railPassId && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {plans.map((plan) => (
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
                    ${plan.fee}
                  </div>
                </div>

                {plan.railpassV2 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Rail Pass: {plan.railpassV2.title} •{" "}
                    {plan.railpassV2.country} • {plan.railpassV2.type} •{" "}
                    {plan.railpassV2.category}
                  </div>
                )}

                {plan.description && (
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {plan.description}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-1">
                  Plan ID: {plan._id.substring(0, 8)}...
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && !isLoading && plans.length === 0 && railPassId && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 p-4">
            <div className="text-xs text-gray-500 text-center">
              {searchTerm
                ? `No plans found matching "${searchTerm}"`
                : "No plans available for this rail pass"}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default SearchableRailPlanDropdown;
