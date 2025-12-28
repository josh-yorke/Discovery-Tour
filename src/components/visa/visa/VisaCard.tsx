import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import ImageCard from "../../cards/ImageCard";
import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import LinkText from "../../nav/LinkText";
import ProcessTag from "../../button/ProcessTag";
import MutedTag from "../../button/MutedTag";
import PriceTag from "../../button/PriceTag";

interface CardProps {
  mainDescription: string;
  country: string;
  type: string;
  images: string[];
  id: string;
  onDelete: () => void;
}

const VisaCard = ({
  onDelete,
  mainDescription,
  country,
  type,
  images,
  id,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-2 gap-2 overflow-hidden shadow-xl shadow-black/10">
      <div className="relative w-full aspect-3/2 rounded-2xl overflow-hidden">
        <div className="absolute right-4 top-4 z-10 flex flex-row gap-2">
          <IconButton
            action={() => navigate(`/visas/visa/edit/${id}`)}
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
        <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-black/30">
          <PriceTag visaId={id} />
        </div>
        <ImageCard style="w-full h-full object-cover" url={images} />
      </div>

      <div className="w-full flex flex-col items-start justify-center p-2 gap-2 flex-1">
        <LinkText
          title={country}
          url={`/visas/visa/view/${id}`}
          style="font-bold text-[#1d2087] hover:text-[#1d2087]"
        />
        <div className="w-full flex flex-col gap-2 flex-1">
          <p className="text-xs font-normal line-clamp-2">{mainDescription}</p>
        </div>
        <div className="w-full border-t border-black/6 border-0 my-2" />
        <div className="w-full flex items-center justify-start gap-2">
          <MutedTag
            color="bg-[#1d2087] hover:bg-[#393ca3] duration-300 cursor-default text-[#1d2087]"
            tag={type}
          />
          <ProcessTag visaId={id} />
        </div>
      </div>
    </div>
  );
};

export default VisaCard;
