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
  const formatRate = (value: string) => {
    return value || "—";
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="bg-linear-to-r from-[#1d2087] to-[#2a2eb5] px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-xl tracking-tight">
            {currencyPair}
          </h3>
          <div className="flex items-center gap-1">
            <IconButton
              action={() => navigate(`/markups/edit/${_id}`)}
              title=""
              icon={<RiPencilFill size={16} />}
              style="bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-all"
            />
            <IconButton
              action={onDelete}
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
              style="bg-white/20 hover:bg-red-500/70 text-white rounded-full p-2.5 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Spread
            </p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {formatRate(spread)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
              Markup
            </p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {formatRate(markUp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkupCard;
