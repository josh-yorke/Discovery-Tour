interface CurrencyCardProps {
  _id: string;
  currencyPair: string;
  ttb: number;
  tts: number;
  ttm: number;
}

const ScrapedDataCard = ({
  currencyPair,
  ttb,
  tts,
  ttm,
}: CurrencyCardProps) => {
  const formatRate = (rate: number) => {
    return rate === 0 ? "N/A" : rate.toFixed(rate % 1 === 0 ? 0 : 3);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-4 gap-4 shadow-xl shadow-black/10">
      <div className="w-full flex items-center justify-between">
        <div className="w-full min-w-0">
          <p className="font-bold text-[#1d2087] text-lg line-clamp-1 wrap-break-word overflow-hidden">
            {currencyPair}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">TTB:</span> {formatRate(ttb)}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">TTS:</span> {formatRate(tts)}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">TTM:</span> {formatRate(ttm)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapedDataCard;
