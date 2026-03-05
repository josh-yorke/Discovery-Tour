import TitleText from "../../cards/TitleText";
import IconButton from "../../button/IconButton";
import Tags from "../../tags/Tags";
import { RiArrowUpSLine, RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import StatusText from "../../cards/StatusText";
import DateText from "../../cards/DateText";
import { useState } from "react";

interface ViewProps {
  _id: string;
  title: string;
  description: string;
  status: "open" | "closed" | "draft";
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship"
    | "Temporary";
  department: string;
  branch: string;
  images?: string[];
  savedAt: string;
  onDelete: (_id: string) => void;
}

const View = ({
  _id,
  title,
  description,
  status,
  employmentType,
  department,
  branch,
  savedAt,
  onDelete,
}: ViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatEmploymentType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <TitleText style="text-[#1d2087]" title={title} />

          <div className="w-full flex flex-wrap gap-2">
            <Tags title={department} />
            <Tags title={branch} />
            <Tags title={formatEmploymentType(employmentType)} />
          </div>

          <div className="w-full flex flex-row gap-2">
            <IconButton
              style="px-3 py-2 rounded-full bg-gray-200"
              action={() => {
                window.open(`/careers/edit/${_id}`, "_blank");
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

        <div className="w-full grid grid-cols-2 border-2 border-dashed p-6 rounded-3xl border-[#1d2087]">
          <div className="flex flex-col items-center justify-center border-r-2 border-black/6">
            <span className="text-xs text-gray-500">Status</span>
            <StatusText
              textStyle="font-semibold truncate"
              style="font-semibold"
              status={status}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500">Date Created</span>
            <DateText
              textStyle="font-semibold line-clamp-1"
              style=""
              date={new Date(savedAt)
                .toLocaleDateString("en-US")
                .replace(/\//g, "-")}
            />
          </div>
        </div>

        <pre className="whitespace-pre-line font-sans bg-white p-6 rounded-3xl shadow-xl shadow-black/6 flex flex-col gap-6">
          <div className="w-full flex flex-row items-center justify-between gap-2">
            <p className="text-base uppercase font-semibold text-[#1d2087]">
              Career Information
            </p>
            <RiArrowUpSLine
              size={24}
              color="#1d2087"
              className={`cursor-pointer transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              onClick={toggleExpand}
            />
          </div>
          <p
            className={`text-sm font-normal ${
              isExpanded ? "" : "line-clamp-1"
            }`}
          >
            {description}
          </p>
        </pre>
      </div>
    </>
  );
};

export default View;
