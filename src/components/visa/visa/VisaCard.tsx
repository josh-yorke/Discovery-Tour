import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import ImageCard from "../../cards/ImageCard";
import {
  RiDeleteBin4Fill,
  RiPencilFill,
  RiMoneyDollarCircleFill,
  RiClockwiseFill,
  RiArrowUpSLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import LinkText from "../../nav/LinkText";
import { useState } from "react";
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

interface ProcessItem {
  processTitle: string;
  process: string;
  _id: string;
  [key: string]: any;
}

interface PricePlan {
  fee: number;
  plan: string;
  description: string;
}

interface PriceData {
  lowestPrice: number;
  plans: PricePlan[];
}

interface VisaData {
  pricelists?: any[];
  processes?: any[];
}

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-[#1d2087]" />
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        {isOpen ? (
          <RiArrowUpSLine size={16} className="text-gray-500" />
        ) : (
          <RiArrowDownSLine size={16} className="text-gray-500" />
        )}
      </button>
      {isOpen && <div className="p-3 bg-white">{children}</div>}
    </div>
  );
};

const VisaCard = ({
  onDelete,
  mainDescription,
  country,
  type,
  images,
  id,
}: CardProps) => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["visaPricelists", id],
    queryFn: () => getVisaPricelists(id),
    select: (data: VisaData) => extractPriceData(data?.pricelists),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: processData, isLoading: isProcessLoading } = useQuery({
    queryKey: ["visaProcesses", id],
    queryFn: () => getVisaProcesses(id),
    select: (data: VisaData) => extractProcessData(data?.processes),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getProcessItems = (): ProcessItem[] => {
    if (isProcessLoading || !processData) return [];
    return processData;
  };

  const renderPriceContent = () => {
    if (isPriceLoading) {
      return (
        <p className="text-sm text-gray-500">Loading price information...</p>
      );
    }

    if (!priceData || !priceData.plans || priceData.plans.length === 0) {
      return (
        <p className="text-sm text-gray-500">Contact us for pricing details</p>
      );
    }

    return (
      <div className="space-y-2">
        {priceData.plans.map((plan: PricePlan, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-800">
              {plan.plan}
            </span>
            <span className="text-sm font-bold text-[#1d2087]">
              ${plan.fee}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderProcessContent = () => {
    if (isProcessLoading) {
      return (
        <p className="text-sm text-gray-500">Loading process information...</p>
      );
    }

    const processItems = getProcessItems();

    if (processItems.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          No processes available for this visa type
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {processItems.map((item: ProcessItem, index: number) => (
          <div
            key={item._id || index}
            className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center justify-center w-6 h-6 bg-[#1d2087] text-white text-xs font-bold rounded-full shrink-0">
              {index + 1}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {item.processTitle || "Untitled Process"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-2 gap-2 overflow-hidden shadow-xl shadow-black/10">
      <div className="relative w-full aspect-3/2 rounded-2xl overflow-hidden">
        <div className="absolute right-4 top-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/visas/visa/edit/${id}`)}
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
        <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-black/30">
          <span className="text-xs font-normal text-white">{type} Visa</span>
        </div>
        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>

      <div className="w-full flex flex-col items-start justify-center p-2 gap-2 flex-1">
        <LinkText
          title={country}
          url={`/visas/visa/view/${id}`}
          style="font-bold text-[#1d2087] hover:text-[#1d2087]"
        />
        <div className="w-full flex flex-col gap-2 flex-1">
          <p className="text-xs font-normal line-clamp-2">{mainDescription}</p>
        </div>
        <div className="w-full border-t border-black/6 border-0 my-2" />

        <div className="w-full space-y-3">
          <CollapsibleSection
            title="Price Information"
            icon={RiMoneyDollarCircleFill}
            isOpen={openSection === "price"}
            onToggle={() => toggleSection("price")}
          >
            {renderPriceContent()}
          </CollapsibleSection>

          <CollapsibleSection
            title="Process Information"
            icon={RiClockwiseFill}
            isOpen={openSection === "process"}
            onToggle={() => toggleSection("process")}
          >
            {renderProcessContent()}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

function extractPriceData(data: any): PriceData | null {
  if (!data || !Array.isArray(data)) return null;

  const validPrices = data
    .filter((item) => item?.fee && !isNaN(parseFloat(item.fee)))
    .map((item) => ({
      fee: parseFloat(item.fee),
      plan: item.plan || "Standard",
      description: item.description || "",
    }));

  if (validPrices.length === 0) return null;

  return {
    lowestPrice: Math.min(...validPrices.map((p) => p.fee)),
    plans: validPrices,
  };
}

function extractProcessData(data: any): ProcessItem[] {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter(
      (item) => item && typeof item === "object" && "processTitle" in item,
    )
    .map((item) => ({
      processTitle: item.processTitle || "",
      process: item.process || "",
      _id: item._id || "",
      ...item,
    }));
}

export default VisaCard;
