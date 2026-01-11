import { useNavigate } from "react-router";
import {
  RiDeleteBin4Fill,
  RiPencilFill,
  RiCarFill,
  RiGasStationFill,
  RiUserFill,
  RiLuggageCartFill,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";
import type { vehicleData } from "../../types/vehicles/vehicleDataTypes";

interface CardProps extends vehicleData {
  onDelete: () => void;
}

const VehicleCard = ({
  onDelete,
  _id,
  images,
  vehicleName,
  vehicleType,
  isAvailable,
  brand,
  model,
  year,
  seatingCapacity,
  luggageCapacity,
  transmission,
  fuelType,
  status,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-2 gap-2 overflow-hidden shadow-xl shadow-black/10">
      <div className="relative w-full aspect-3/2 rounded-2xl overflow-hidden">
        <div className="absolute right-4 top-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/transport/vehicles/edit/${_id}`)}
            title=""
            icon={<RiPencilFill size={16} />}
            style="bg-white/80 text-[#1d2087] rounded-full p-3 hover:scale-120"
          />
          <IconButton
            action={onDelete}
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
            style="bg-white/80 text-[#1d2087] rounded-full p-3 hover:scale-120"
          />
        </div>
        <div className="absolute top-4 left-4 z-10">
          <div className="flex px-3 py-1.5 rounded-lg items-center justify-start text-white bg-black/30">
            <p className="text-xs font-medium capitalize">{status}</p>
          </div>
        </div>
        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>

      <div className="w-full flex flex-col items-start justify-center p-2 gap-3 flex-1">
        {/* Vehicle Name Header - Consistent styling */}
        <div className="w-full flex flex-col items-center justify-center p-3 rounded-xl bg-linear-to-tr from-[#1d2087] to-[#393ca3] text-white">
          <h3 className="font-bold text-sm text-center truncate w-full">
            {vehicleName}
          </h3>
          <p className="text-xs font-normal text-white/60 mt-1">
            {brand} {model} • {year}
          </p>
        </div>

        {/* Vehicle Specifications Grid - Uniform layout */}
        <div className="w-full grid grid-cols-2 gap-3">
          {/* Vehicle Type */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <RiCarFill size={14} className="text-[#1d2087]" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">Type</span>
              <span className="text-xs font-medium capitalize truncate">
                {vehicleType}
              </span>
            </div>
          </div>

          {/* Seating Capacity */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <RiUserFill size={14} className="text-[#1d2087]" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">Seats</span>
              <span className="text-xs font-medium truncate">
                {seatingCapacity} seats
              </span>
            </div>
          </div>

          {/* Transmission */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <RiCarFill size={14} className="text-[#1d2087]" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">
                Transmission
              </span>
              <span className="text-xs font-medium capitalize truncate">
                {transmission}
              </span>
            </div>
          </div>

          {/* Fuel Type */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <RiGasStationFill size={14} className="text-[#1d2087]" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">Fuel</span>
              <span className="text-xs font-medium capitalize truncate">
                {fuelType}
              </span>
            </div>
          </div>

          {/* Luggage Capacity */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <RiLuggageCartFill size={14} className="text-[#1d2087]" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">Luggage</span>
              <span className="text-xs font-medium truncate">
                {luggageCapacity}
              </span>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            {isAvailable ? (
              <RiCheckboxCircleFill size={14} className="text-green-600" />
            ) : (
              <RiCloseCircleFill size={14} className="text-red-600" />
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">Available</span>
              <span className="text-xs font-medium truncate">
                {isAvailable ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
