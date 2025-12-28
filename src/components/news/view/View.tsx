import { RiArrowUpSLine, RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import type { newsData } from "../../../types/news/newsDataTypes";
import IconButton from "../../button/IconButton";
import DateText from "../../cards/DateText";
import StatusText from "../../cards/StatusText";
import TitleText from "../../cards/TitleText";
import Tags from "../../tags/Tags";
import { useState } from "react";

interface ViewProps extends newsData {
  savedAt: string;
  onDelete: (_id: string) => void;
}

const View = ({
  _id,
  title,
  contents,
  tags,
  savedAt,
  status,
  onDelete,
}: ViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <TitleText style="text-[#1d2087]" title={title} />
          <div className="w-full flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <Tags key={tag} title={tag} />
            ))}
          </div>
          <div className="w-full flex flex-row gap-2">
            <IconButton
              style="px-3 py-2 rounded-full bg-gray-200"
              action={() => {
                window.open(`/news/edit/${_id}`, "_blank");
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
          <div className="flex justify-center items-center border-r-2 border-black/6">
            <StatusText
              textStyle="font-semibold truncate"
              style="font-semibold"
              status={status}
            />
          </div>
          <div className="flex justify-center items-center ">
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
              News Information
            </p>
            <RiArrowUpSLine
              size={24}
              className={`cursor-pointer transition-transform duration-300 text-[#1d2087] ${
                isExpanded ? "rotate-180" : ""
              }`}
              onClick={toggleExpand}
            />
          </div>
          <p
            className={`text-sm font-normal ${
              isExpanded ? "" : "line-clamp-6"
            }`}
          >
            {contents}
          </p>
        </pre>
      </div>
    </>
  );
};

export default View;
