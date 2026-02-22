import {
  RiArrowUpSLine,
  RiDeleteBin4Fill,
  RiInformationFill,
  RiPencilFill,
  RiBuildingLine,
  RiGlobalLine,
  RiTimeLine,
} from "react-icons/ri";
import { useState } from "react";
import TitleText from "../../cards/TitleText";
import ImageCard from "../../cards/ImageCard";
import IconButton from "../../button/IconButton";

interface Props {
  _id: string;
  partnerName: string;
  type: string;
  typeV2?: {
    _id: string;
    partnerType: string;
    savedAt: string;
  };
  websiteUrl: string;
  image: string;
  dateAdded: string;
  onDelete: (_id: string) => void;
}

const View = ({
  _id,
  partnerName,
  type,
  typeV2,
  websiteUrl,
  image,
  dateAdded,
  onDelete,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <TitleText style="text-[#1d2087]" title={partnerName} />

          <div className="w-full flex flex-row gap-2">
            <IconButton
              style="px-3 py-2 rounded-full bg-gray-200"
              action={() => {
                window.open(`/partners/edit/${_id}`, "_blank");
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
              <span className="text-xs font-medium text-gray-600">
                Partner Type
              </span>
              <span className="font-bold text-sm text-[#1d2087] uppercase">
                {typeV2?.partnerType || type}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600">
                Date Added
              </span>
              <span className="font-bold text-sm text-[#1d2087] uppercase">
                {new Date(dateAdded).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* About Partner section */}
        <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
                <RiInformationFill size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-base md:text-lg font-semibold text-black uppercase">
                  About {partnerName}
                </p>
                <p className="text-xs font-normal text-gray-600">
                  Partner information and details
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
              <div className="w-full pt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <RiBuildingLine className="text-[#1d2087]" size={20} />
                  <span className="text-sm font-normal text-gray-600">
                    Type:{" "}
                    <span className="font-medium text-black">
                      {typeV2?.partnerType || type}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RiGlobalLine className="text-[#1d2087]" size={20} />
                  <span className="text-sm font-normal text-gray-600">
                    Website:
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 font-medium text-blue-600 hover:underline"
                    >
                      {websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RiTimeLine className="text-[#1d2087]" size={20} />
                  <span className="text-sm font-normal text-gray-600">
                    Added:{" "}
                    <span className="font-medium text-black">
                      {new Date(dateAdded).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <ImageCard
          style="w-full h-[400px] object-cover rounded-3xl"
          url={[image]}
        />
      </div>
    </>
  );
};

export default View;
