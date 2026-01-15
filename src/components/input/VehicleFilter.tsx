import { useState, useEffect, useRef } from "react";
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

interface VehicleFilterProps {
  value: string;
  onChange: (vehicleId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const VehicleFilter = ({
  value,
  onChange,
  placeholder = "Search vehicles...",
  disabled = false,
}: VehicleFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles", searchTerm],
    queryFn: () => getAllVehicles(searchTerm),
    enabled: (searchTerm.length > 0 || isOpen) && !disabled,
    staleTime: 300000,
  });

  useEffect(() => {
    const loadVehicleDisplayName = async () => {
      if (!value?.trim()) {
        setDisplayText("");
        return;
      }

      try {
        const { vehicles: allVehicles } = await getAllVehicles("");
        const vehicle = allVehicles.find((v: Vehicle) => v._id === value);
        setDisplayText(
          vehicle
            ? `${vehicle.vehicleName} (${vehicle.brand} ${vehicle.model} - ${vehicle.year})`
            : ""
        );
      } catch (error) {
        console.error("Error loading vehicle:", error);
        setDisplayText("");
      }
    };

    if (!disabled) {
      loadVehicleDisplayName();
    }
  }, [value, disabled]);

  const getDisplayName = (vehicle: Vehicle) =>
    `${vehicle.vehicleName} (${vehicle.brand} ${vehicle.model} - ${vehicle.year})`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setDisplayText(newSearchTerm);
    setIsOpen(true);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setDisplayText(getDisplayName(vehicle));
    onChange(vehicle._id);
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

  const showDropdown = isOpen && !isLoading && vehicles?.vehicles?.length > 0;

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
            {vehicles?.vehicles.map((vehicle: Vehicle) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleFilter;
