import {
  RiArrowUpSLine,
  RiDeleteBin4Fill,
  RiInformationFill,
  RiPencilFill,
  RiBuildingLine,
  RiMapPinLine,
} from "react-icons/ri";
import { useState, useEffect } from "react";
import TitleText from "../../../cards/TitleText";
import Tags from "../../../tags/Tags";
import type { insuranceData } from "../../../../types/insurances/insuranceDataTypes";
import IconButton from "../../../button/IconButton";

interface Props extends insuranceData {
  onDelete: (_id: string) => void;
}

const InsuranceInformation = ({
  _id,
  country,
  insurancePartner,
  countryV2,
  insurancePartnerV2,
  title,
  description,
  dateAdded,
  onDelete,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [displayCountry, setDisplayCountry] = useState(country);
  const [displayPartner, setDisplayPartner] = useState(insurancePartner);

  useEffect(() => {
    if (countryV2?.country) {
      setDisplayCountry(countryV2.country);
    }
    if (insurancePartnerV2?.name) {
      setDisplayPartner(insurancePartnerV2.name);
    }
  }, [countryV2, insurancePartnerV2]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formattedDate = new Date(dateAdded).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <TitleText style="text-[#1d2087]" title={title} />
          <div className="w-full flex flex-wrap gap-2">
            {displayCountry && (
              <Tags key={displayCountry} title={displayCountry} />
            )}
            {displayPartner && (
              <Tags key={displayPartner} title={displayPartner} />
            )}
            <Tags key={formattedDate} title={formattedDate} />
          </div>
          <div className="w-full flex flex-row gap-2">
            <IconButton
              style="px-3 py-2 rounded-full bg-gray-200"
              action={() => {
                window.open(`/insurance/edit/${_id}`, "_blank");
              }}
              title="Edit"
              icon={<RiPencilFill size={16} />}
            />
            <IconButton
              style="px-3 py-2 rounded-full bg-gray-200"
              action={() => onDelete(_id)}
              title="Delete"
              icon={<RiDeleteBin4Fill size={16} />}
            />
          </div>
        </div>

        <div className="w-full border-2 border-dashed p-4 rounded-3xl border-[#1d2087]">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <RiMapPinLine size={12} /> Country
              </span>
              <span className="font-bold text-sm text-[#1d2087] uppercase">
                {displayCountry}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <RiBuildingLine size={12} /> Insurance Partner
              </span>
              <span className="font-bold text-sm text-[#1d2087] uppercase">
                {displayPartner || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
                <RiInformationFill size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-base md:text-lg font-semibold text-black uppercase">
                  About
                </p>
                <p className="text-xs font-normal text-gray-600">
                  Learn more about this insurance policy
                </p>
              </div>
            </div>
            <RiArrowUpSLine
              size={24}
              className={`cursor-pointer transition-transform duration-300 text-[#1d2087] ${
                isExpanded ? "rotate-180" : ""
              }`}
              onClick={toggleExpand}
            />
          </div>

          {isExpanded && (
            <>
              <div className="w-full border-b border-black/6" />
              <div className="w-full pt-2">
                <p className="text-sm font-normal text-gray-600 whitespace-pre-line">
                  {description}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceInformation;
