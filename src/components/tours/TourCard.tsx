import { useNavigate } from "react-router";
import {
  RiDeleteBin4Fill,
  RiMapPinRangeFill,
  RiPencilFill,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "../cards/ImageCard";
import LinkText from "../nav/LinkText";

interface CardProps {
  id: string;
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
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-lg overflow-hidden shadow-xl shadow-black/10">
      <div className="relative w-full aspect-3/2">
        <div className="absolute right-6 top-6 z-10 flex flex-row gap-2">
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
        <ImageCard style="w-full h-full" url={images} />
      </div>
      <div className="w-full flex flex-col items-start justify-center p-6 gap-2">
        <div className="w-full flex flex-row items-center justify-end gap-1 text-black/60">
          <RiMapPinRangeFill size={16} />
          <p className="text-xs font-semibold whitespace-nowrap">
            {mainLocationName}
          </p>
        </div>
        <LinkText
          title={country}
          url={`/visas/visa/view/${id}`}
          style="font-semibold"
        />
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs font-semibold">{type.tourType}</p>
          <p className="text-xs font-normal line-clamp-2">{mainDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
