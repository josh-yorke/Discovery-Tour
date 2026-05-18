import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { getTransportPricelists } from "../../hooks/visa/visa/getVisa";

interface Plan {
  _id: string;
  plan: string;
  fee: number | null;
  description: string;
  currency: string;
  filesAssociated: any[];
  visa: any;
  tour: any;
  railpass: any;
  transport: string;
  vehicle: {
    _id: string;
    vehicleName: string;
    vehicleType: string;
    brand: string;
    model: string;
    year: number;
    seatingCapacity: number;
    luggageCapacity: string;
    transmission: string;
    fuelType: string;
    isAvailable: boolean;
    status: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  dateAdded: string;
  __v: number;
}

interface SearchablePlanDropdownProps {
  disabled: boolean;
  title: string;
  value: string;
  onChange: (planId: string, vehicleId: string) => void;
  transportId?: string;
  placeholder?: string;
  error?: string;
}

const SearchablePlanDropdown = ({
  disabled,
  title,
  value,
  onChange,
  transportId = "",
  placeholder = `Search ${title.toLowerCase()}...`,
  error,
}: SearchablePlanDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  const getDisplayName = (plan: Plan): string => {
    const vehicleInfo = plan.vehicle
      ? ` - ${plan.vehicle.vehicleName} (${plan.vehicle.vehicleType})`
      : "";
    const feeDisplay =
      plan.fee && plan.fee > 0
        ? `${plan.currency || "USD"} ${plan.fee}`
        : "Price TBD";
    return `${plan.plan}${vehicleInfo} (${feeDisplay})`;
  };

  useEffect(() => {
    const initializePlan = async () => {
      if (value && value.trim() !== "" && transportId) {
        try {
          const { pricelists } = await getTransportPricelists(
            transportId || "",
          );
          const plan = pricelists.find((p: Plan) => p._id === value);
          if (plan) {
            setSearchTerm(getDisplayName(plan));
          }
        } catch (error) {
          console.error("Error initializing plan:", error);
        }
      }
    };

    initializePlan();
  }, [value, transportId]);

  const fetchPlans = useCallback(
    async (search: string) => {
      if (!transportId) {
        setPlans([]);
        return;
      }

      try {
        if (!isInitialMount.current) {
          setIsLoading(true);
        }

        const { pricelists } = await getTransportPricelists(transportId || "");

        let filteredPlans = pricelists;
        if (search.trim()) {
          filteredPlans = pricelists.filter(
            (plan: Plan) =>
              plan.plan.toLowerCase().includes(search.toLowerCase()) ||
              plan.description?.toLowerCase().includes(search.toLowerCase()) ||
              plan.vehicle?.vehicleName
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              plan.vehicle?.vehicleType
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
    [transportId],
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
      onChange("", ""); // Clear both plan and vehicle
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSearchTerm(getDisplayName(plan));
    onChange(plan._id, plan.vehicle?._id || "");
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && plans.length === 0 && transportId) {
      fetchPlans("");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("", ""); // Clear both plan and vehicle
    setIsOpen(true);
    if (transportId) {
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

  // Fetch plans when transportId changes
  useEffect(() => {
    if (transportId) {
      fetchPlans("");
    } else {
      setPlans([]);
      setSearchTerm("");
    }
  }, [transportId, fetchPlans]);

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
          disabled={disabled || !transportId}
          placeholder={!transportId ? "Select a transport first" : placeholder}
          className="w-full text-xs font-normal outline-none capitalize bg-transparent disabled:opacity-50 pr-8"
        />

        {searchTerm && !disabled && transportId && (
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

        {!transportId && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔒
          </div>
        )}

        {isOpen && plans.length > 0 && transportId && (
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
                    {plan.fee && plan.fee > 0
                      ? `${plan.currency || "USD"} ${plan.fee}`
                      : "Price TBD"}
                  </div>
                </div>

                {plan.vehicle && (
                  <div className="text-xs text-gray-500 mt-1">
                    Vehicle: {plan.vehicle.vehicleName} •{" "}
                    {plan.vehicle.vehicleType} • {plan.vehicle.brand}{" "}
                    {plan.vehicle.model} ({plan.vehicle.year})
                  </div>
                )}

                {plan.description && (
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {plan.description}
                  </div>
                )}

                {plan.vehicle && (
                  <div className="text-xs text-gray-400 mt-1">
                    Capacity: {plan.vehicle.seatingCapacity} seats •{" "}
                    {plan.vehicle.luggageCapacity} • {plan.vehicle.transmission}{" "}
                    • {plan.vehicle.fuelType}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-1">
                  Plan ID: {plan._id.substring(0, 8)}...
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && !isLoading && plans.length === 0 && transportId && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 p-4">
            <div className="text-xs text-gray-500 text-center">
              {searchTerm
                ? `No plans found matching "${searchTerm}"`
                : "No plans available for this transport"}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default SearchablePlanDropdown;
