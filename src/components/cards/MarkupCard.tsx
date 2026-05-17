import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../button/IconButton";

interface MarkupCardProps {
  _id: string;
  spread: string;
  markUp: string;
  currencyPair: string;
  ttb: string;
  ttm: string;
  tts: string;
  onDelete: () => void;
}

const MarkupCard = ({
  _id,
  spread,
  markUp,
  currencyPair,
  onDelete,
  ttb,
  ttm,
  tts,
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
              title="Edit markup"
              icon={<RiPencilFill size={16} />}
              style="bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-all"
            />
            <IconButton
              action={onDelete}
              title="Delete markup"
              icon={<RiDeleteBin4Fill size={16} />}
              style="bg-white/20 hover:bg-red-500/70 text-white rounded-full p-2.5 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
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

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Exchange Rates
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-lg bg-green-50">
              <p className="text-[10px] font-bold text-green-700 uppercase">
                TTB
              </p>
              <p className="text-xs text-gray-600 mt-0.5">Bank Buys</p>
              <p className="text-sm font-bold text-green-800 mt-1">
                {formatRate(ttb)}
              </p>
            </div>

            <div className="text-center p-2 rounded-lg bg-gray-50">
              <p className="text-[10px] font-bold text-gray-600 uppercase">
                TTM
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Middle</p>
              <p className="text-sm font-bold text-gray-700 mt-1">
                {formatRate(ttm)}
              </p>
            </div>

            <div className="text-center p-2 rounded-lg bg-orange-50">
              <p className="text-[10px] font-bold text-orange-700 uppercase">
                TTS
              </p>
              <p className="text-xs text-gray-600 mt-0.5">Bank Sells</p>
              <p className="text-sm font-bold text-orange-800 mt-1">
                {formatRate(tts)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              You sell → Bank buys (TTB)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              You buy ← Bank sells (TTS)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkupCard;
