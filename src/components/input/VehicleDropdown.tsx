// components/input/VehicleSearchDropdown.tsx
import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
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

interface VehicleSearchDropdownProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const VehicleSearchDropdown = forwardRef<
  HTMLInputElement,
  VehicleSearchDropdownProps
>(
  (
    {
      name,
      value,
      onChange,
      disabled = false,
      placeholder = "Search vehicles...",
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Use imperative handle to create a proper input ref
    useImperativeHandle(
      ref,
      () =>
        ({
          focus: () => inputRef.current?.focus(),
          blur: () => inputRef.current?.blur(),
        } as any)
    );

    // Fetch vehicles based on search term
    const { data: vehicles, isLoading } = useQuery({
      queryKey: ["vehicles", searchTerm],
      queryFn: () => getAllVehicles(searchTerm),
      enabled: searchTerm.length > 0 || isOpen,
      staleTime: 1000 * 60 * 5,
    });

    const getDisplayName = (vehicle: Vehicle): string => {
      return `${vehicle.vehicleName} (${vehicle.brand} ${vehicle.model} - ${vehicle.year})`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value;
      setSearchTerm(newSearchTerm);
      setIsOpen(true);

      // If clearing the input, clear the value
      if (!newSearchTerm.trim()) {
        onChange("");
      }
    };

    const handleVehicleSelect = (vehicle: Vehicle) => {
      // Set the display text in the search input
      setSearchTerm(getDisplayName(vehicle));
      // Pass the vehicle ID to the parent
      onChange(vehicle._id);
      setIsOpen(false);
    };

    const handleInputFocus = () => {
      setIsOpen(true);
    };

    // Close dropdown when clicking outside
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
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative w-full" ref={containerRef}>
        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 text-sm bg-transparent outline-none disabled:opacity-50"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          </div>
        )}

        {/* Dropdown menu */}
        {isOpen &&
          (searchTerm.length > 0 || vehicles?.vehicles?.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200">
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Loading...
                </div>
              ) : vehicles?.vehicles?.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No vehicles found
                </div>
              ) : (
                vehicles?.vehicles.map((vehicle: Vehicle) => (
                  <div
                    key={vehicle._id}
                    onClick={() => handleVehicleSelect(vehicle)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {vehicle.vehicleName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {vehicle.brand} {vehicle.model} • {vehicle.year} •{" "}
                      {vehicle.vehicleType} • {vehicle.seatingCapacity} seats
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
      </div>
    );
  }
);

VehicleSearchDropdown.displayName = "VehicleSearchDropdown";

export default VehicleSearchDropdown;
