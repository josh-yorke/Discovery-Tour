import {
  RiDeleteBin4Line,
  RiHashtag,
  RiHourglassLine,
  RiPencilLine,
} from "react-icons/ri";
import IconButton from "../button/IconButton";
import ImageCard from "./ImageCard";
import { useNavigate } from "react-router";

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
  tags,
  status,
  onDelete,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex flex-col items-center justify-between rounded-lg bg-white overflow-hidden flex-wrap"
      key={id}
    >
      <ImageCard url={images} />
      <div className="w-full flex flex-col items-start justify-center gap-2 p-6">
        <p className="text-sm font-semibold">{title}</p>
        <div className="w-full flex flex-row gap-1 items-center justify-start text-sm">
          <RiHourglassLine size={16} className="text-black/50" />
          <p className="uppercase text-xs text-black/50">{status}</p>
        </div>
        <p className="text-sm font-normal line-clamp-2">{contents}</p>
        <div className="w-full flex flex-row gap-2">
          {tags.map((tag: string) => (
            <p className="flex flex-row gap-2 text-xs font-normal px-3 py-2 bg-[#1d2087] text-white rounded-sm uppercase">
              <RiHashtag size={16} />
              {tag}
            </p>
          ))}
        </div>
        <div className="w-full flex flex-row items-center justify-end gap-2 pt-6">
          <IconButton
            icon={<RiPencilLine size={16} />}
            title="Edit"
            action={() => navigate(`/news/edit/${id}`)}
            style="bg-gray-200 text-black p-3 rounded-md"
          />
          <IconButton
            icon={<RiDeleteBin4Line size={16} />}
            title="Delete"
            action={onDelete}
            style="bg-gray-200 text-black p-3 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
