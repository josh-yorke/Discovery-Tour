import { useNavigate } from "react-router";
import {
  RiDeleteBin4Fill,
  RiMapPinRangeFill,
  RiPencilFill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";
import LinkText from "../nav/LinkText";
import MutedTag from "../button/MutedTag";

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

const TourCard = ({
  onDelete,
  id,
  country,
  mainDescription,
  images,
  mainLocationName,
  type,
  tags,
  title,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-2 gap-2 overflow-hidden shadow-xl shadow-black/10">
      <div className="relative w-full aspect-3/2 rounded-2xl overflow-hidden">
        <div className="absolute right-4 top-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/tours/edit/${id}`)}
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
        <div className="absolute top-4 left-4 z-10">
          <div className="flex px-4 py-2 rounded-lg items-center justify-start text-white bg-black/30">
            <p className="text-xs font-normal">{type.tourType}</p>
          </div>
        </div>
        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>
      <div className="w-full flex flex-col items-start justify-center p-2 gap-4 flex-1">
        <div className="w-fill flex flex-col items-start justify-center gap-1 flex-1">
          <LinkText
            title={title}
            url={`/tours/view/${id}`}
            style="font-bold text-[#1d2087] hover:text-[#393ca3]"
          />
          <p className="text-xs font-normal line-clamp-2">{`${mainDescription}`}</p>
        </div>
        <div className="w-full flex flex-row items-center justify-start gap-2">
          {tags.map((tag: string, id) => (
            <MutedTag color="text-[#1d2087]" key={id} tag={tag} />
          ))}
        </div>
        <div className="w-full border-t border-black/6 border-0" />
        <div className="w-full flex flex-row items-center justify-between">
          {/* Main Location Name - Limited to 50% width */}
          <div className="flex flex-row items-center justify-center gap-1 text-[#1d2087] w-1/2 min-w-0 pr-2">
            <RiMapPinRangeFill size={16} className="shrink-0" />
            <p className="text-xs font-semibold truncate">{mainLocationName}</p>
          </div>

          <div className="px-6 py-3 rounded-full bg-linear-to-tr from-[#1d2087] to-[#393ca3] cursor-pointer hover:scale-105 transition-transform duration-300 w-1/2 min-w-0">
            <p className="text-xs font-semibold text-white truncate text-center">
              {country} tour
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
