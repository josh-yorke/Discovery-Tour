import { useNavigate } from "react-router";
import IconButton from "../button/IconButton";
import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import ImageCard from "./ImageCard";
import LinkText from "../nav/LinkText";
import StatusText from "./StatusText";
import Tags from "../tags/Tags";

interface CardProps {
  id: string;
  title: string;
  contents: string;
  tags: string[];
  status: string;
  images: string[];
  onDelete: () => void;
}

const PromotionsCard = ({
  id,
  title,
  contents,
  tags,
  status,
  images,
  onDelete,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center bg-white rounded-lg overflow-hidden shadow-xl shadow-black/10">
        <div className="relative w-full h-[40vh]">
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
          <ImageCard style="w-full h-full" url={images} />
        </div>
        <div className="w-full flex flex-col items-start justify-center p-6 gap-2">
          <LinkText
            title={title}
            style="font-semibold"
            url={`/promotions/view/${id}`}
          />
          <div className="w-full flex flex-col">
            <StatusText status={status} style="" textStyle="font-semibold" />
            <p className="text-xs font-normal line-clamp-2">{`${contents}`}</p>
          </div>
          <div className="w-full flex flex-row gap-2">
            {tags.map((tag: string, id) => (
              <Tags title={tag} key={id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PromotionsCard;
