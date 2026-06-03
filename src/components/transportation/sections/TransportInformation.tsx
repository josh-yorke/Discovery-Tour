import {
  RiArrowUpSLine,
  RiDeleteBin4Fill,
  RiInformationFill,
  RiPencilFill,
} from "react-icons/ri";
import { useState } from "react";
import type { transportationData } from "../../../types/transportation/transportationDataTypes";
import TitleText from "../../cards/TitleText";
import Tags from "../../tags/Tags";
import IconButton from "../../button/IconButton";
import { useNavigate } from "react-router";

interface Props extends transportationData {
  onDelete: (_id: string) => void;
}

const TransportInformation = ({
  _id,
  country,
  typeV2,
  title,
  description,
  onDelete,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <TitleText style="text-[#1d2087]" title={title} />
          <div className="w-full flex flex-wrap gap-2">
            <Tags key={country} title={country} />
          </div>
          <div className="w-full flex flex-row gap-2">
            <IconButton
              style="px-3 py-2 rounded-full bg-gray-200"
              action={() => {
                navigate(`/transport/transportation/edit/${_id}`);
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
              <span className="text-xs font-medium text-gray-600">Country</span>
              <span className="font-bold text-sm text-[#1d2087] uppercase">
                {country}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600">
                Transport Type
              </span>
              <span className="font-bold text-sm text-[#1d2087] uppercase">
                {typeV2?.transportType || "N/A"}
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
                  Learn more about this transportation service
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
    </>
  );
};

export default TransportInformation;
