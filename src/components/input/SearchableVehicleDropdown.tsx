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
  disabled: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
}

const SearchableVehicleDropdown = ({
  disabled,
  title,
  value,
  onChange,
  placeholder = `Search ${title.toLowerCase()}...`,
}: SearchableDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const getDisplayName = (vehicle: Vehicle): string => {
    return `${vehicle.vehicleName} (${vehicle.brand} ${vehicle.model} - ${vehicle.year})`;
  };

  useEffect(() => {
    const initializeVehicle = async () => {
      if (value && typeof value === "string" && value.trim() !== "") {
        setIsLoading(true);
        try {
          const { vehicles: allVehicles } = await getAllVehicles("");
          const vehicle = allVehicles.find((v: any) => v._id === value);
          if (vehicle) {
            setSearchTerm(getDisplayName(vehicle));
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

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      fetchVehicles(newSearchTerm);
    }, 300);

    // Only clear the selection if we're actually clearing an existing selection
    // (when search is empty and we previously had a value selected)
    if (!newSearchTerm.trim() && value) {
      onChange("");
    }

    // Always clear vehicles list when search is empty
    if (!newSearchTerm.trim()) {
      setVehicles([]);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSearchTerm(getDisplayName(vehicle));
    onChange(vehicle._id);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchTerm && vehicles.length === 0) {
      fetchVehicles("");
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
          disabled={disabled || isLoading}
          placeholder={isLoading ? "Loading..." : placeholder}
          className="w-full text-xs font-normal outline-none capitalize bg-transparent disabled:opacity-50"
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b border-black/6"></div>
          </div>
        )}

        {isOpen && vehicles.length > 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                onClick={() => handleVehicleSelect(vehicle)}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-black/6 last:border-b-0 ${
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

        {isOpen && !isLoading && vehicles.length === 0 && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-white rounded-3xl shadow-lg z-50 p-4">
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
