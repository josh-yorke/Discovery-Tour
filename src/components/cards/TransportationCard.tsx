import {
  RiArrowRightDownLine,
  RiCarFill,
  RiMoneyDollarCircleFill,
  RiDeleteBin4Fill,
  RiPencilFill,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import IconButton from "../button/IconButton";
import ImageCard from "./ImageCard";
import LinkText from "../nav/LinkText";
import GlassTag from "../tags/GlassTag";
import { getTransportPricelists } from "../../hooks/visa/visa/getVisa";

interface CardProps {
  _id: string;
  country: string;
  title: string;
  description: string;
  images: string[];
  type: {
    transportType: string;
  };
  onDelete: () => void;
}

interface PriceItem {
  _id: string;
  fee: number;
  priceCurrency?: string;
  currency?: string;
}

// Currency symbol mapping
const currencySymbols: Record<string, string> = {
  USD: "$",
  KRW: "₩",
  JPY: "¥",
  PHP: "₱",
  EUR: "€",
  GBP: "£",
};

const TransportationCard = ({
  _id,
  title,
  country,
  images,
  type,
  onDelete,
}: CardProps) => {
  const { data: priceData, isLoading } = useQuery({
    queryKey: ["transportPricelists", _id],
    queryFn: () => getTransportPricelists(_id),
    select: (data) => {
      if (!data?.pricelists || !Array.isArray(data.pricelists)) {
        return { lowestPrice: null, currency: null };
      }

      // Filter valid price items
      const validPriceItems = data.pricelists
        .filter(
          (item: PriceItem) =>
            item?.fee && !isNaN(parseFloat(item.fee.toString())),
        )
        .filter((item: PriceItem) => parseFloat(item.fee.toString()) > 0.01);

      if (validPriceItems.length === 0) {
        return { lowestPrice: null, currency: null };
      }

      // Get the minimum price item
      const minPriceItem = validPriceItems.reduce(
        (min: PriceItem, item: PriceItem) =>
          parseFloat(item.fee.toString()) < parseFloat(min.fee.toString())
            ? item
            : min,
      );

      const lowestPrice = parseFloat(minPriceItem.fee.toString());

      // Get currency from the price item (handle both priceCurrency and currency fields)
      const currency =
        minPriceItem.priceCurrency || minPriceItem.currency || "USD";

      return { lowestPrice, currency };
    },
    enabled: !!_id,
    staleTime: 5 * 60 * 1000,
  });

  const renderPriceText = () => {
    if (isLoading) {
      return <span className="text-xs font-semibold text-black/60">...</span>;
    }

    if (!priceData || priceData.lowestPrice === null) {
      return (
        <span className="text-xs font-semibold text-black/60">
          No price available
        </span>
      );
    }

    const symbol = currencySymbols[priceData.currency] || priceData.currency;

    return (
      <span className="text-xs font-semibold text-black/60">
        as low as {symbol}
        {priceData.lowestPrice.toLocaleString()}
      </span>
    );
  };

  const handleEditClick = () => {
    window.location.href = `/transport/transportation/edit/${_id}`;
  };

  const handleViewClick = () => {
    window.location.href = `/transport/transportation/view/${_id}`;
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
          <GlassTag style="" icon text={type.transportType} />
        </div>

        <ImageCard style="w-full h-full object-cover" url={images || []} />
      </div>

      <div className="w-full flex flex-row flex-1 items-center justify-between px-2">
        <div className="w-3/4 flex flex-col gap-1 items-start justify-center">
          <LinkText
            title={title}
            url={`/transport/transportation/view/${_id}`}
            style="font-bold text-[#1d2087] hover:text-[#1d2087] truncate"
          />
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <div className="max-w-1/2 flex items-center gap-1">
              <RiMoneyDollarCircleFill
                className="text-[#1d2087] shrink-0"
                size={16}
              />
              <p className="text-xs font-normal truncate">
                {renderPriceText()}
              </p>
            </div>
            <div className="border h-full border-l border-black/60"></div>
            <div className="max-w-1/2 flex items-center gap-1">
              <RiCarFill className="text-[#1d2087] shrink-0" size={16} />
              <p className="text-xs font-normal truncate">{country}</p>
            </div>
          </div>
        </div>
        <div
          className="p-3 rounded-full bg-linear-to-br from-[#1d2087] to-[#393ca3] group cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={handleViewClick}
        >
          <RiArrowRightDownLine
            className="text-white rotate-0 group-hover:rotate-360 duration-300 ease-in-out"
            size={16}
          />
        </div>
      </div>
    </div>
  );
};

export default TransportationCard;
