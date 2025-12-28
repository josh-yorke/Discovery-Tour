import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "./ImageCard";
import { useNavigate } from "react-router";
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
  onDelete: () => void;
  savedAt: string;
  slug: string;
}

const NewsCard = ({
  id,
  title,
  contents,
  images,
  status,
  onDelete,
  tags,
  savedAt,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-2 gap-2 overflow-hidden shadow-xl shadow-black/10">
      <div className="relative w-full aspect-3/2 rounded-2xl overflow-hidden">
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
        <div className="absolute top-4 left-4 z-10">
          <div className="flex px-4 py-2 rounded-lg items-center justify-start text-white bg-black/30">
            <p className="text-xs font-normal">
              {new Date(savedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>

      <div className="w-full flex flex-col items-start justify-center p-2 gap-2 flex-1">
        <StatusText status={status} style="" textStyle="font-semibold" />
        <LinkText
          title={title}
          url={`/news/view/${id}`}
          style="font-bold text-[#1d2087] hover:text-[#393ca3]"
        />
        <p className="text-xs font-normal line-clamp-2">{`${contents}`}</p>
        <div className="w-full border-t border-black/6 border-0 my-2" />

        <div className="w-full flex flex-row items-center justify-star gap-2">
          {tags.map((tag: string, id) => (
            <MutedTag color="text-[#1d2087]" key={id} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
