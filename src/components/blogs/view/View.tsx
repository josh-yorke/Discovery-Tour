import { useState } from "react";
import {
  RiDeleteBin4Fill,
  RiPencilFill,
  RiArrowUpSLine,
  RiLink,
  RiLinkUnlink,
} from "react-icons/ri";
import IconButton from "../../button/IconButton";
import DateText from "../../cards/DateText";
import StatusText from "../../cards/StatusText";
import TitleText from "../../cards/TitleText";
import Tags from "../../tags/Tags";
import type { blogData } from "../../../types/blogs/blogDataTypes";

interface ViewProps extends blogData {
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
  readingTimeValue,
  readingTimeUnit,
  relatedLinks,
  onDelete,
}: ViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Filter valid links
  const validLinks = relatedLinks
    ? relatedLinks.filter(
        (link): link is string => link !== null && link !== undefined
      )
    : [];

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <TitleText style="text-[#1d2087]" title={title} />
          <div className="w-full flex flex-row gap-2">
            {tags.map((tag: string) => (
              <Tags key={tag} title={tag} />
            ))}
          </div>
          <div className="w-full flex flex-row gap-2">
            <IconButton
              style="px-3 py-2 rounded-sm bg-gray-200 hover:bg-gray-300"
              action={() => {
                window.open(`/blogs/edit/${_id}`, "_blank");
              }}
              title="Edit"
              icon={<RiPencilFill size={16} />}
            />
            <IconButton
              style="px-3 py-2 rounded-sm bg-gray-200 hover:bg-gray-300"
              action={() => onDelete(_id)}
              title="Delete"
              icon={<RiDeleteBin4Fill size={16} />}
            />
          </div>
        </div>
        <div className="w-full border-2 border-dashed p-6 rounded-lg border-[#1d2087]">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600">Status</span>
              <StatusText
                textStyle="font-semibold text-[#1d2087]"
                style=""
                status={status}
              />
            </div>

            {/* Reading Time */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600">
                Reading Time
              </span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[#1d2087]">
                  {readingTimeValue}
                </span>
                <span className="font-semibold text-[#1d2087]">
                  {readingTimeUnit}
                  {readingTimeValue !== "1" ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Published Date */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600">
                Published Date
              </span>
              <DateText
                textStyle="font-semibold line-clamp-1 text-[#1d2087]"
                style=""
                date={new Date(savedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </div>
          </div>
        </div>
        <pre className="whitespace-pre-line font-sans bg-white p-6 rounded-lg shadow-xl shadow-black/6 flex flex-col gap-6">
          <div className="w-full flex flex-row items-center justify-between gap-2">
            <p className="text-base uppercase font-semibold text-[#1d2087]">
              Blog Information
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

        {/* Related Links Section */}
        <div className="whitespace-pre-line font-sans bg-white p-6 rounded-lg shadow-xl shadow-black/6 flex flex-col gap-4">
          <div className="w-full flex flex-row items-center justify-between gap-2">
            <p className="text-base uppercase font-semibold text-[#1d2087]">
              Related Links & Resources
            </p>
          </div>

          {validLinks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {validLinks.map((link: string, index: number) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-[#1d2087] hover:text-[#0a0d5c] transition-colors group"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-[#1d2087]/10 rounded-md shrink-0">
                    <span className="text-xs font-semibold text-[#1d2087]">
                      {index + 1}
                    </span>
                  </div>
                  <span className="group-hover:underline grow truncate">
                    {link}
                  </span>
                  <RiLink
                    size={16}
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-black/60">
              <RiLinkUnlink size={32} />
              <p className="text-sm font-normal text-center">
                No related links available for this blog.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default View;
