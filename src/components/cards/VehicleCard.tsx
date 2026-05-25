import {
  RiCarFill,
  RiUserFill,
  RiDeleteBin4Fill,
  RiPencilFill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";
import LinkText from "../nav/LinkText";
import GlassTag from "../tags/GlassTag";
import type { vehicleData } from "../../types/vehicles/vehicleDataTypes";

interface CardProps extends vehicleData {
  onDelete: () => void;
}

const VehicleCard = ({
  onDelete,
  _id,
  images,
  vehicleName,
  brand,
  model,
  year,
  status,
}: CardProps) => {
  const handleEditClick = () => {
    window.location.href = `/transport/vehicles/edit/${_id}`;
  };

  return (
    <div className="w-full flex flex-col overflow-hidden gap-4">
      <div className="relative w-full aspect-3/2 rounded-3xl overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex flex-row gap-2">
          <IconButton
            action={handleEditClick}
            title=""
            icon={<RiPencilFill size={16} />}
            style="bg-white/80 text-[#1d2087] rounded-full p-2 hover:scale-110 backdrop-blur-sm"
          />
          <IconButton
            action={onDelete}
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
            style="bg-white/80 text-[#1d2087] rounded-full p-2 hover:scale-110 backdrop-blur-sm"
          />
        </div>

        <div className="absolute top-4 right-4 z-10">
          <GlassTag style="" icon text={status} />
        </div>

        <ImageCard url={images} style="" />
      </div>

      <div className="w-full flex flex-row flex-1 items-center justify-between px-2">
        <div className="w-3/4 flex flex-col gap-1 items-start justify-center">
          <LinkText
            title={vehicleName}
            style="font-bold text-[#1d2087] hover:text-[#1d2087] truncate"
          />
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <div className="max-w-1/2 flex items-center gap-1">
              <RiCarFill className="text-[#1d2087] shrink-0" size={16} />
              <p className="text-xs font-normal truncate">{`${brand} ${model}`}</p>
            </div>
            <div className="border h-full border-l border-black/60"></div>
            <div className="max-w-1/2 flex items-center gap-1">
              <RiUserFill className="text-[#1d2087] shrink-0" size={16} />
              <p className="text-xs font-normal truncate">{year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
