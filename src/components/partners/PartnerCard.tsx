import {
  RiArrowRightDownLine,
  RiHashtag,
  RiGlobalLine,
  RiDeleteBin4Fill,
  RiPencilFill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import LinkText from "../nav/LinkText";
import GlassTag from "../tags/GlassTag";
import ImageCard from "../cards/ImageCard";

interface CardProps {
  id: string;
  partnerName: string;
  type: string;
  logoImage: string;
  websiteUrl: string;
  dateAdded: string;
  onDelete: () => void;
}

const PartnerCard = ({
  id,
  partnerName,
  type,
  logoImage,
  websiteUrl,
  dateAdded,
  onDelete,
}: CardProps) => {
  const handleEditClick = () => {
    window.location.href = `/partners/edit/${id}`;
  };

  const handleViewClick = () => {
    window.location.href = `/partners/view/${id}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length <= maxLength
      ? text
      : text.substring(0, maxLength) + "...";
  };

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
            text={new Date(dateAdded).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            style=""
            icon
          />
        </div>

        <ImageCard url={[logoImage]} style="" />

        <div className="absolute bottom-4 left-4 z-10">
          <GlassTag
            icon={<RiHashtag size={12} color="white" className="shrink-0" />}
            text={type}
            style="flex flex-row gap-1 items-center justify-center"
          />
        </div>
      </div>

      <div className="flex flex-row flex-1 items-center justify-between px-2">
        <div className="w-3/4 flex flex-col gap-2 items-start justify-center">
          <LinkText
            title={partnerName}
            url={`/partners/view/${id}`}
            style="w-full font-bold text-[#1d2087] hover:text-[#1d2087] truncate"
          />
          {websiteUrl && (
            <div className="w-full flex items-center gap-1">
              <RiGlobalLine className="text-[#1d2087] shrink-0" size={16} />
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-normal text-gray-600 hover:text-[#1d2087] truncate"
              >
                {truncateText(websiteUrl.replace(/^https?:\/\//, ""), 30)}
              </a>
            </div>
          )}
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

export default PartnerCard;
