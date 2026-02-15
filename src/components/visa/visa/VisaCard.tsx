import {
  RiArrowRightDownLine,
  RiMoneyDollarCircleFill,
  RiClockwiseFill,
  RiDeleteBin4Fill,
  RiPencilFill,
} from "react-icons/ri";
import IconButton from "../../button/IconButton";
import ImageCard from "../../cards/ImageCard";
import LinkText from "../../nav/LinkText";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getVisaPricelists,
  getVisaProcesses,
} from "../../../hooks/visa/visa/getVisa";

interface CardProps {
  mainDescription: string;
  country: string;
  type: string;
  images: string[];
  id: string;
  onDelete: () => void;
}

interface PriceItem {
  _id: string;
  fee: number;
  priceCurrency?: string;
  currency?: string;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  KRW: "₩",
  JPY: "¥",
  PHP: "₱",
  EUR: "€",
  GBP: "£",
};

const VisaCard = ({ onDelete, country, type, images, id }: CardProps) => {
  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["visaPricelists", id],
    queryFn: () => getVisaPricelists(id),
    enabled: !!id,
  });

  const { data: processData, isLoading: isProcessLoading } = useQuery({
    queryKey: ["visaProcesses", id],
    queryFn: () => getVisaProcesses(id),
    enabled: !!id,
  });

  const { minPrice, currency, hasPriceData } = useMemo(() => {
    if (isPriceLoading || !priceData) {
      return { minPrice: null, currency: null, hasPriceData: false };
    }

    if (
      typeof priceData === "object" &&
      priceData.pricelists &&
      Array.isArray(priceData.pricelists)
    ) {
      // Filter valid price items
      const validPriceItems = priceData.pricelists
        .filter(
          (item: PriceItem) =>
            item?.fee && !isNaN(parseFloat(item.fee.toString())),
        )
        .filter((item: PriceItem) => parseFloat(item.fee.toString()) > 0.01);

      if (validPriceItems.length === 0) {
        return { minPrice: null, currency: null, hasPriceData: false };
      }

      // Get the minimum price item
      const minPriceItem = validPriceItems.reduce(
        (min: PriceItem, item: PriceItem) =>
          parseFloat(item.fee.toString()) < parseFloat(min.fee.toString())
            ? item
            : min,
      );

      const min = parseFloat(minPriceItem.fee.toString());

      // Get currency from the price item (handle both priceCurrency and currency fields)
      const currencyCode =
        minPriceItem.priceCurrency || minPriceItem.currency || "USD";

      return {
        minPrice: min,
        currency: currencyCode,
        hasPriceData: true,
      };
    }

    return { minPrice: null, currency: null, hasPriceData: false };
  }, [priceData, isPriceLoading]);

  const { processCount, hasProcessData } = useMemo(() => {
    if (isProcessLoading || !processData)
      return { processCount: 0, hasProcessData: false };

    if (
      typeof processData === "object" &&
      processData.processes &&
      Array.isArray(processData.processes)
    ) {
      const count = processData.processes.length;
      return { processCount: count, hasProcessData: count > 0 };
    }

    return { processCount: 0, hasProcessData: false };
  }, [processData, isProcessLoading]);

  const handleEditClick = () => {
    window.location.href = `/visas/visa/edit/${id}`;
  };

  const handleViewClick = () => {
    window.location.href = `/visas/visa/view/${id}`;
  };

  // Format price display with currency symbol
  const getPriceDisplay = () => {
    if (!hasPriceData || !minPrice || !currency) {
      return null;
    }

    const symbol = currencySymbols[currency] || currency;
    return `from ${symbol}${minPrice.toLocaleString()}`;
  };

  const priceDisplay = getPriceDisplay();

  return (
    <div className="w-full flex flex-col gap-4">
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
          <div className="flex px-4 py-2 rounded-lg items-center justify-start text-white bg-black/30 backdrop-blur-sm">
            <p className="text-xs font-normal">{type} Visa</p>
          </div>
        </div>

        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>

      <div className="flex flex-row flex-1 items-center justify-between px-2">
        <div className="w-3/4 flex flex-col gap-2 items-start justify-center">
          <LinkText
            title={country}
            url={`/visas/visa/view/${id}`}
            style="font-bold text-[#1d2087] hover:text-[#1d2087] truncate"
          />
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <div className="max-w-1/2 flex items-center gap-1">
              <RiClockwiseFill className="text-[#1d2087] shrink-0" size={16} />
              <p className="text-xs font-normal truncate">
                {hasProcessData ? `${processCount} processes` : "No process"}
              </p>
            </div>
            <div className="border h-full border-l border-black/60"></div>
            {hasPriceData && priceDisplay ? (
              <div className="max-w-1/2 flex items-center gap-1">
                <RiMoneyDollarCircleFill
                  className="text-[#1d2087] shrink-0"
                  size={16}
                />
                <p className="text-xs font-normal truncate">{priceDisplay}</p>
              </div>
            ) : (
              <p className="text-xs font-normal text-gray-500">No price</p>
            )}
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

export default VisaCard;
