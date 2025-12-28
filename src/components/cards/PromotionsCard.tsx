import { useNavigate } from "react-router";
import IconButton from "../button/IconButton";
import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import ImageCard from "./ImageCard";
import LinkText from "../nav/LinkText";
import StatusText from "./StatusText";
import MutedTag from "../button/MutedTag";

interface CardProps {
  id: string;
  title: string;
  contents: string;
  tags: string[];
  status: string;
  images: string[];
  savedAt: string;
  onDelete: () => void;
}

const PromotionsCard = ({
  id,
  title,
  tags,
  status,
  images,
  onDelete,
  savedAt,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-2 gap-2 overflow-hidden shadow-xl shadow-black/10">
      <div className="w-full flex flex-col items-start justify-center p-2 gap-1 flex-1">
        <LinkText
          title={title}
          url={`/promotions/view/${id}`}
          style="font-bold text-[#1d2087] hover:text-[#1d2087]"
        />

        <p className="text-sm text-black/60  font-semibold">
          {new Date(savedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <StatusText status={status} style="" textStyle="font-semibold" />
      </div>
      <div className="relative w-full aspect-3/2 rounded-xl overflow-hidden">
        <div className="absolute right-4 top-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/promotions/edit/${id}`)}
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
        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>
      <div className="w-full flex flex-col items-start justify-center p-2 gap-2 flex-1">
        <div className="w-full flex flex-row items-center justify-star gap-2">
          {tags.map((tag: string, id) => (
            <MutedTag color="text-[#1d2087]" key={id} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionsCard;
