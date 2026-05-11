import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../button/IconButton";

interface MarkupCardProps {
  _id: string;
  spread: string;
  markUp: string;
  currencyPair: string;
  onDelete: () => void;
}

const MarkupCard = ({
  _id,
  spread,
  markUp,
  currencyPair,
  onDelete,
}: MarkupCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-4 gap-4 shadow-xl shadow-black/10">
      <div className="w-full flex items-center justify-between">
        <div className="w-full min-w-0">
          <p className="font-bold text-[#1d2087] text-lg line-clamp-1 wrap-break-word overflow-hidden">
            {currencyPair}
          </p>
          <div className="flex gap-3 mt-1">
            <p className="text-sm font-medium text-gray-700">
              Spread: <span className="font-normal">{spread}</span>
            </p>
            <p className="text-sm font-medium text-gray-700">
              Markup: <span className="font-normal">{markUp}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            action={() => navigate(`/markups/edit/${_id}`)}
            title=""
            icon={<RiPencilFill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
          <IconButton
            action={onDelete}
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default MarkupCard;
