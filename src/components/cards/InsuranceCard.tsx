import {
  RiBuildingLine,
  RiCalendarLine,
  RiBuilding2Fill,
  RiDeleteBin4Fill,
  RiPencilFill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "./ImageCard";
import LinkText from "../nav/LinkText";
import GlassTag from "../tags/GlassTag";
import { useEffect, useMemo, useState } from "react";
import { getInsurancePricelist } from "../../hooks/visa/pricelist/getPriceList";
import { PiPawPrintFill } from "react-icons/pi";
import { FaFileInvoiceDollar } from "react-icons/fa";

interface CardProps {
  id: string;
  title: string;
  country: string;
  insurancePartner: string | null;
  images: string[];
  onDelete: () => void;
  dateAdded: string;
  countryV2?: {
    _id: string;
    country: string;
    savedAt: string;
    __v: number;
  } | null;
  insurancePartnerV2?: {
    _id: string;
    partnerName: string;
    type: string;
    logoImage: string;
    websiteUrl: string;
    dateAdded: string;
    __v: number;
  } | null;
}

interface PriceItem {
  _id: string;
  plan: string;
  fee: number;
  description: string;
  priceCurrency?: string;
  currency?: string;
  filesAssociated: string[];
  insuranceId: string;
  dateAdded: string;
  __v: number;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  KRW: "₩",
  JPY: "¥",
  PHP: "₱",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SAR: "﷼",
};

const InsuranceCard = ({
  id,
  title,
  images,
  country,
  insurancePartner,
  countryV2,
  insurancePartnerV2,
  onDelete,
  dateAdded,
}: CardProps) => {
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [showData, setShowData] = useState(false);

  const displayCountry = countryV2?.country || country;
  const displayPartner =
    insurancePartnerV2?.partnerName || insurancePartner || "No partner";

  const priceDisplay = useMemo(() => {
    if (priceList.length === 0) {
      return "Flexible";
    }

    const minPriceItem = priceList.reduce((min, item) =>
      item.fee < min.fee ? item : min,
    );

    const minPrice = minPriceItem.fee;
    const currency =
      minPriceItem.priceCurrency || minPriceItem.currency || "USD";
    const symbol = currencySymbols[currency] || currency;

    if (minPrice === 0 || minPrice < 0.01) {
      return "Flexible";
    }

    return `from ${symbol}${minPrice.toLocaleString()}`;
  }, [priceList]);

  const formatDate = useMemo(() => {
    return new Date(dateAdded).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [dateAdded]);

  useEffect(() => {
    let mounted = true;

    const fetchPriceList = async () => {
      try {
        const data = await getInsurancePricelist(id);
        if (mounted) {
          const priceData = Array.isArray(data) ? data : data?.pricelists || [];
          setPriceList(priceData);
          setShowData(true);
        }
      } catch (error) {
        if (mounted) setShowData(true);
      }
    };

    fetchPriceList();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleEditClick = () => {
    window.location.href = `/insurance/edit/${id}`;
  };

  const handleViewClick = () => {
    window.location.href = `/insurance/view/${id}`;
  };

  if (!showData) return null;

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
          <GlassTag
            text={formatDate}
            style="flex flex-row gap-1 items-center justify-center"
            icon={<RiCalendarLine size={12} color="white" />}
          />
        </div>

        <ImageCard url={images} style="" />

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="w-full flex flex-row gap-2 flex-wrap">
            <GlassTag
              text={displayCountry}
              style="flex flex-row gap-1 items-center justify-center"
              icon={<RiBuildingLine size={12} color="white" />}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-1 items-center justify-between px-2">
        <div className="w-3/4 flex flex-col gap-2 items-start justify-center">
          <LinkText
            title={title}
            url={`/insurance/view/${id}`}
            style="font-bold text-[#1d2087] hover:text-[#1d2088] truncate"
          />
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <div className="flex items-center justify-center gap-1 min-w-0">
              <RiBuilding2Fill className="text-[#1d2087] shrink-0" size={16} />
              <p className="text-xs font-normal truncate">{displayPartner}</p>
            </div>
            <div className="border h-full border-l border-black/60"></div>
            <div className="flex items-center justify-center gap-1">
              <FaFileInvoiceDollar
                className="text-[#1d2087] shrink-0"
                size={16}
              />
              <p className="text-xs font-normal truncate">{priceDisplay}</p>
            </div>
          </div>
        </div>
        <div
          className="p-3 rounded-full bg-linear-to-br from-[#1d2087] to-[#393ca3] group cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={handleViewClick}
        >
          <PiPawPrintFill
            className="text-white rotate-0 group-hover:rotate-360 duration-300 ease-in-out"
            size={16}
          />
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;
