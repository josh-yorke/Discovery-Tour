import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { getAllVehicles } from "../../hooks/vehicles/vehicles";

interface Vehicle {
  _id: string;
  vehicleName: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: string;
  seatingCapacity: number;
}

interface SearchableDropdownProps {
  style: string;
  title: string;
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
}

const SearchableVehicleDropdown = ({
  disabled,
  title,
  style,
  value,
  onChange,
  name,
  placeholder = `Search ${title.toLowerCase()}...`,
}: SearchableDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  // Get display name for a vehicle
  const getDisplayName = (vehicle: Vehicle): string => {
    return `${vehicle.vehicleName} (${vehicle.brand} ${vehicle.model} - ${vehicle.year})`;
  };

  // Initialize with current value when component mounts
  useEffect(() => {
    const initializeVehicle = async () => {
      // Check if value exists and is a string
      if (
        value &&
        typeof value === "string" &&
        value.trim() !== "" &&
        !hasInitializedRef.current
      ) {
        setIsLoading(true);
        try {
          // Fetch all vehicles to find the matching one
          const { vehicles: allVehicles } = await getAllVehicles("");
          const vehicle = allVehicles.find((v: any) => v._id === value);
          if (vehicle) {
            setSearchTerm(getDisplayName(vehicle));
            hasInitializedRef.current = true;
          }
        } catch (error) {
          console.error("Error initializing vehicle:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeVehicle();
  }, [value]);

  const fetchVehicles = useCallback(async (search: string) => {
    try {
      setIsLoading(true);
      const { vehicles } = await getAllVehicles(search);
      setVehicles(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = window.setTimeout(() => {
      fetchVehicles(newSearchTerm);
    }, 300);

    // If input is cleared, clear selection
    if (!newSearchTerm.trim()) {
      onChange("");
      hasInitializedRef.current = false;
      setVehicles([]); // Clear vehicles list
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSearchTerm(getDisplayName(vehicle));
    onChange(vehicle._id);
    setIsOpen(false);
    hasInitializedRef.current = true;
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // Only fetch if we don't have vehicles already or search term is empty
    if (!searchTerm && vehicles.length === 0) {
      fetchVehicles("");
    }
  };

  // Close dropdown when clicking outside
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

  // Clear debounce timer on unmount
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
      <div className={`px-4 py-2.5 rounded-full ${style} relative w-full`}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          disabled={disabled || isLoading}
          placeholder={isLoading ? "Loading..." : placeholder}
          className="text-xs font-normal outline-none capitalize w-full bg-transparent disabled:opacity-50"
        />

        {/* Hidden select for form compatibility */}
        <select
          className="hidden"
          disabled={disabled}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          name={name}
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Dropdown options */}
        {isOpen && vehicles.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                onClick={() => handleVehicleSelect(vehicle)}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 ${
                  vehicle._id === value ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-xs font-medium capitalize">
                  {vehicle.vehicleName}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {vehicle.brand} {vehicle.model} • {vehicle.year} •{" "}
                  {vehicle.vehicleType} • {vehicle.seatingCapacity} seats
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {isOpen && !isLoading && vehicles.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-4">
            <div className="text-xs text-gray-500 text-center">
              {searchTerm
                ? `No vehicles found matching "${searchTerm}"`
                : "No vehicles available"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableVehicleDropdown;
