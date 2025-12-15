import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "./ImageCard";
import { useNavigate } from "react-router";
import LinkText from "../nav/LinkText";
import StatusText from "./StatusText";

interface CardProps {
  id: string;
  title: string;
  contents: string;
  tags: string[];
  status: string;
  images: string[];
  onDelete: () => void;
}

const NewsCard = ({
  id,
  title,
  contents,
  images,
  status,
  onDelete,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col bg-white rounded-lg overflow-hidden shadow-xl shadow-black/10">
      {/* Image container with fixed aspect ratio */}
      <div className="relative w-full aspect-3/2">
        <div className="absolute right-4 top-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/news/edit/${id}`)}
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

      {/* Content container that grows independently */}
      <div className="flex flex-col flex-1 p-6 gap-2">
        <LinkText
          title={title}
          style="font-semibold"
          url={`/news/view/${id}`}
        />
        <StatusText status={status} style="" textStyle="font-semibold" />
        <p className="text-xs font-normal line-clamp-2 flex-1">{`${contents}`}</p>
      </div>
    </div>
  );
};

export default NewsCard;
