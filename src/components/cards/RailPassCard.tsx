import {
  RiDeleteBin4Fill,
  RiMoneyDollarCircleFill,
  RiPencilFill,
  RiTrainFill,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { getPassPricelists } from "../../hooks/visa/visa/getVisa";
import LinkText from "../nav/LinkText";
import ImageCard from "./ImageCard";
import IconButton from "../button/IconButton";
import { useNavigate } from "react-router";

interface CardProps {
  _id: string;
  country: string;
  category: string;
  title: string;
  description: string;
  images: string[];
  type: {
    railPassType: string;
  };
  onDelete: () => void;
}

const RailPassCard = ({
  _id,
  title,
  country,
  description,
  images,
  onDelete,
  type,
}: CardProps) => {
  const { data: lowestPrice, isLoading } = useQuery({
    queryKey: ["railPassPricelists", _id],
    queryFn: () => getPassPricelists(_id),
    select: (data) => {
      if (!data?.pricelists || !Array.isArray(data.pricelists)) return null;

      const validPrices = data.pricelists
        .filter((item: any) => item.fee && !isNaN(parseFloat(item.fee)))
        .map((item: any) => parseFloat(item.fee));

      return validPrices.length > 0 ? Math.min(...validPrices) : null;
    },
    enabled: !!_id,
    staleTime: 5 * 60 * 1000,
  });

  const renderPriceText = () => {
    if (isLoading) {
      return <span className="text-xs font-semibold text-black/60">...</span>;
    }

    if (lowestPrice === null) {
      return (
        <span className="text-xs font-semibold text-black/60">
          No price available
        </span>
      );
    }

    return (
      <span className="text-xs font-semibold text-black/60">
        as low as ${lowestPrice}
      </span>
    );
  };

  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-2 gap-2 overflow-hidden shadow-xl shadow-black/10">
      <div className="relative w-full aspect-3/2 rounded-2xl overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <div className="flex px-3 py-1.5 rounded-lg items-center justify-start text-white bg-black/30">
            <p className="text-xs font-medium truncate max-w-30">
              {type.railPassType}
            </p>
          </div>
        </div>
        <div className="absolute right-4 top-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/transport/rail-passes/edit/${_id}`)}
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

        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>

      <div className="w-full flex flex-col items-start justify-center p-2 gap-3 flex-1">
        <div className="w-full flex flex-col items-center justify-center gap-1">
          <LinkText
            title={title}
            url={`transport/rail-passes/view/${_id}`}
            style="font-bold text-[#1d2087] hover:text-[#393ca3] text-center truncate w-full"
          />
          <p className="text-xs font-normal text-black/60">
            {country} Rail Pass
          </p>
        </div>

        {/* Rail Pass Details Grid - Uniform layout */}
        <div className="w-full grid grid-cols-2 gap-3">
          {/* Price Information */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <RiMoneyDollarCircleFill size={14} className="text-[#1d2087]" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">Price</span>
              <span className="text-xs font-medium truncate">
                {renderPriceText()}
              </span>
            </div>
          </div>

          {/* Country */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <RiTrainFill size={14} className="text-[#1d2087]" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">Country</span>
              <span className="text-xs font-medium truncate">{country}</span>
            </div>
          </div>

          {/* Rail Pass Type */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg col-span-2">
            <RiTrainFill size={14} className="text-[#1d2087]" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 truncate">Pass Type</span>
              <span className="text-xs font-medium truncate">
                {type.railPassType}
              </span>
            </div>
          </div>
        </div>

        {/* Description - Styled consistently */}
        <div className="w-full p-2 bg-gray-50 rounded-lg">
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-gray-500 mb-1">Description</span>
            <p className="text-xs font-normal text-gray-700 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RailPassCard;
