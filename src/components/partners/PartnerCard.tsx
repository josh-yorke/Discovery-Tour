import { RiDeleteBin4Fill, RiPencilFill, RiGlobalLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";
import LinkText from "../nav/LinkText";
import GlassTag from "../tags/GlassTag";

interface CardProps {
  id: string;
  partnerName: string;
  type: string;
  logoImage: string;
  websiteUrl: string;
  dateAdded: string;
  onDelete: () => void;
  onEdit?: () => void;
}

const PartnerCard = ({
  id,
  partnerName,
  logoImage,
  websiteUrl,
  dateAdded,
  onDelete,
  onEdit,
}: CardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/partners/edit/${id}`);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length <= maxLength
      ? text
      : text.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full aspect-3/2 rounded-3xl overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <GlassTag text={formatDate(dateAdded)} style="" icon />
        </div>

        <ImageCard
          tags={false}
          style="w-full h-full object-cover"
          url={[logoImage]}
        />

        <div className="w-full flex flex-row items-center justify-between gap-2 absolute bottom-8 h-4 px-6">
          <div className="w-3/4 flex flex-col items-start justify-center">
            <LinkText
              title={partnerName}
              url={`/partners/view/${id}`}
              style="w-full font-bold text-white hover:text-black/20 truncate"
            />
            {websiteUrl && (
              <div className="w-full flex items-center gap-1">
                <RiGlobalLine className="text-white shrink-0" size={16} />
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-normal text-white hover:text-black/20 duration-700 truncate"
                >
                  {truncateText(websiteUrl.replace(/^https?:\/\//, ""), 30)}
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <IconButton
              action={handleEditClick}
              title=""
              icon={<RiPencilFill size={16} />}
              style="bg-white text-[#1d2087] rounded-full p-3 hover:bg-gray-100"
            />
            <IconButton
              action={onDelete}
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
              style="bg-white text-[#1d2087] rounded-full p-3 hover:bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
