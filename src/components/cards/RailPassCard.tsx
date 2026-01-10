import { useNavigate } from "react-router";
import {
  RiDeleteBin4Fill,
  RiMoneyDollarCircleFill,
  RiPencilFill,
  RiTrainFill,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";
import LinkText from "../nav/LinkText";
import { getPassPricelists } from "../../hooks/visa/visa/getVisa";

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
  onDelete,
  _id,
  title,
  country,
  description,
  images,
  type,
}: CardProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-2 gap-2 overflow-hidden shadow-xl shadow-black/10">
      <div className="relative w-full aspect-3/2 rounded-2xl overflow-hidden">
        <div className="absolute right-4 top-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/rail-passes/edit/${_id}`)}
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
          <div className="flex px-4 py-2 rounded-lg items-center justify-start text-white bg-black/30">
            <p className="text-xs font-normal truncate max-w-30">
              {type.railPassType}
            </p>
          </div>
        </div>
        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>
      <div className="w-full flex flex-col items-start justify-center p-2 gap-4 flex-1">
        <div className="w-full flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center justify-start gap-1 min-w-0">
            <RiMoneyDollarCircleFill size={20} color="#1d2087" />
            {renderPriceText()}
          </div>
          <div className="flex flex-row items-center justify-end gap-1 min-w-0">
            <RiTrainFill size={16} color="#1d2087" />
            <p className="text-xs font-semibold text-[#1d2087] truncate max-w-20">
              {country}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-1 flex-1 min-w-0">
          <LinkText
            title={title}
            url={`/rail-passes/view/${_id}`}
            style="font-bold text-[#1d2087] hover:text-[#393ca3] truncate w-full"
          />
          <p className="text-xs font-normal line-clamp-2 wrap-break-word">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RailPassCard;
