interface CurrencyCardProps {
  _id: string;
  currencyPair: string;
  ttb: number;
  tts: number;
  ttm: number;
  createdAt: string;
}

const ScrapedDataCard = ({
  currencyPair,
  ttb,
  tts,
  ttm,
  createdAt,
}: CurrencyCardProps) => {
  const formatRate = (rate: number) => {
    return rate === 0 ? "N/A" : rate.toFixed(rate % 1 === 0 ? 0 : 3);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isRecentlyUpdated = () => {
    if (!createdAt) return false;
    const date = new Date(createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours < 1;
  };

  return (
    <div className="group w-full bg-white rounded-xl border border-gray-200 hover:border-[#1d2087]/30 hover:shadow-md transition-all duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-[#1d2087] text-base">
            {currencyPair}
          </span>
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-[10px] text-gray-400">
              {formatDate(createdAt)}
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isRecentlyUpdated()
                  ? "bg-green-400 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Rate Row */}
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex-1 text-center">
            <p className="text-[10px] font-semibold text-green-600 uppercase">
              TTB
            </p>
            <p className="text-sm font-bold text-gray-800">{formatRate(ttb)}</p>
            <p className="text-[9px] text-gray-400">Bank buys</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex-1 text-center">
            <p className="text-[10px] font-semibold text-gray-500 uppercase">
              TTM
            </p>
            <p className="text-sm font-bold text-gray-800">{formatRate(ttm)}</p>
            <p className="text-[9px] text-gray-400">Middle</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex-1 text-center">
            <p className="text-[10px] font-semibold text-orange-600 uppercase">
              TTS
            </p>
            <p className="text-sm font-bold text-gray-800">{formatRate(tts)}</p>
            <p className="text-[9px] text-gray-400">Bank sells</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapedDataCard;
