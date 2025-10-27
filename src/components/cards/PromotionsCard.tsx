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
    <div
      className="w-full flex flex-col items-center justify-between rounded-xl bg-white overflow-hidden flex-wrap p-4 gap-6"
      key={id}
    >
      <ImageCard url={images} style="h-[30vh] overflow-hidden rounded-lg" />
      <div className="w-full flex flex-col items-start justify-center gap-2">
        <LinkText
          title={title}
          style="uppercase font-bold"
          url={`/promotions/view/${id}`}
        />
        <StatusText style="" status={status} textStyle="font-semibold" />
        <p className="text-sm font-normal line-clamp-2">{contents}</p>
        <div className="w-full flex flex-row gap-2">
          {tags.map((tag: string, id) => (
            <Tags title={tag} key={id} />
          ))}
        </div>
        <div className="w-full flex flex-row items-center justify-end gap-2 pt-6">
          <IconButton
            icon={<RiPencilFill size={16} />}
            title="Edit"
            action={() => navigate(`/promotions/edit/${id}`)}
            style="w-full bg-[#1d2087] hover:bg-[#3b3eac] text-white text-black p-3 rounded-md"
          />
          <IconButton
            icon={<RiDeleteBin4Fill size={16} />}
            title="Delete"
            action={onDelete}
            style="w-full bg-gray-200 text-black p-3 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionsCard;
