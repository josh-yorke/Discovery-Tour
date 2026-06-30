import { useNavigate } from "react-router";
import {
  RiAddLine,
  RiHashtag,
  RiDeleteBin4Fill,
  RiPencilFill,
  RiMapPin2Fill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";
import LinkText from "../nav/LinkText";
import { useMemo, useState, useEffect } from "react";
import { PiPawPrintFill } from "react-icons/pi";
import { getTourPricelist } from "../../hooks/visa/pricelist/getPriceList";
import { getTourCities } from "../../hooks/visa/document/getDocument";
import { FaFileInvoiceDollar } from "react-icons/fa";

interface CardProps {
  id: string;
  title: string;
  country: string;
  category: string;
  mainLocationName: string;
  mainDescription: string;
  tags: string[];
  images: string[];
  type: {
    tourType: string;
  };
  onDelete: () => void;
}

interface PriceItem {
  _id: string;
  plan: string;
  fee: number;
  description: string;
  priceCurrency?: string;
  currency?: string;
  filesAssociated: string[];
  tour: string;
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
};

const TourCard = ({
  onDelete,
  id,
  images,
  tags = [],
  title,
  type,
}: CardProps) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [showData, setShowData] = useState(false);

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

  const formatCitiesDisplay = useMemo(() => {
    if (cities.length === 0) return "No cities included";
    if (cities.length === 1) return cities[0];
    return `${cities.length} cities`;
  }, [cities]);

  const displayTags = useMemo(() => {
    if (!tags.length) return { visibleTags: [], overflowCount: 0 };

    let maxVisibleTags = 2;

    if (windowWidth >= 1024) {
      maxVisibleTags = 3;
    } else if (windowWidth >= 640) {
      maxVisibleTags = 2;
    }

    const visibleTags = tags.slice(0, maxVisibleTags);
    const overflowCount = Math.max(0, tags.length - maxVisibleTags);

    return { visibleTags, overflowCount };
  }, [tags, windowWidth]);

  const truncateTag = (tag: string) => {
    return tag.length <= 10 ? tag : tag.substring(0, 10) + "...";
  };

  useEffect(() => {
    let mounted = true;

    const fetchCities = async () => {
      if (!id) return;

      try {
        const data = await getTourCities(id);
        if (mounted && data?.cities) {
          setCities(data.cities as string[]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };

    fetchCities();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;

    const fetchPriceList = async () => {
      try {
        const data = await getTourPricelist(id);
        if (mounted) {
          // getTourPricelist returns the data directly from res.data.data
          // If it returns an array directly, use it; if it has a pricelists property, use that
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!showData) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full aspect-3/2 rounded-3xl overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/tours/edit/${id}`)}
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
            <p className="text-xs font-normal">{type.tourType}</p>
          </div>
        </div>

        <ImageCard url={images} style="" />

        {tags.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="w-full flex flex-row gap-2 flex-wrap">
              {displayTags.visibleTags.map((tag: string, index: number) => (
                <div
                  key={`${tag}-${index}`}
                  className="flex flex-row gap-1 items-center justify-center px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/20"
                >
                  <RiHashtag size={12} color="white" className="shrink-0" />
                  <p className="text-xs font-medium text-white">
                    {truncateTag(tag)}
                  </p>
                </div>
              ))}

              {displayTags.overflowCount > 0 && (
                <div className="flex flex-row items-center justify-center px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/20">
                  <RiAddLine size={12} color="white" />
                  <p className="text-xs font-medium text-white ml-1">
                    {displayTags.overflowCount.toString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row flex-1 items-center justify-between px-2">
        <div className="w-3/4 flex flex-col gap-2 items-start justify-center">
          <LinkText
            title={title}
            url={`/tours/view/${id}`}
            style="font-bold text-[#1d2087] hover:text-[#1d2088] truncate"
          />
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <div className="flex items-center justify-center gap-1 min-w-0">
              <RiMapPin2Fill className="text-[#1d2087] shrink-0" size={16} />
              <p className="text-xs font-normal truncate">
                {formatCitiesDisplay}
              </p>
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
          onClick={() => navigate(`/tours/view/${id}`)}
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

export default TourCard;
