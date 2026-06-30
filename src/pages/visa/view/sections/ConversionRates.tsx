import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { RiMoneyDollarCircleFill, RiExchangeFill } from "react-icons/ri";
import { getMarkups } from "../../../../hooks/markups/markups";
import SectionError from "../../../../components/error/SectionError";
import SectionLoader from "../../../../components/loader/SectionLoader";

interface MarkupData {
  currencyPair: string;
  markUp: number;
  spread: number;
  ttb: number;
  tts: number;
  ttm: number;
}

const CURRENCY_CONFIG = {
  KRW: {
    formatter: (v: number) => Math.round(v).toLocaleString("ko-KR"),
    flag: "🇰🇷",
  },
  JPY: {
    formatter: (v: number) =>
      v.toLocaleString("ja-JP", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    flag: "🇯🇵",
  },
  PHP: {
    formatter: (v: number) =>
      v.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    flag: "🇵🇭",
  },
  USD: {
    formatter: (v: number) =>
      v.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    flag: "🇺🇸",
  },
};

const getCalculatedRate = (data: MarkupData): number => {
  const { currencyPair, tts, ttm, markUp } = data;

  if (currencyPair === "USD/KRW" || currencyPair === "USD/PHP") {
    return ttm + markUp;
  }

  if (currencyPair === "USD/JPY") {
    if (tts > 0) return tts + markUp;
    if (ttm > 0) return ttm + markUp;
    return markUp;
  }

  return (tts > 0 ? tts : ttm) + markUp;
};

const formatCurrency = (value: number, currency: string): string => {
  return (
    CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG]?.formatter(
      value,
    ) || value.toString()
  );
};

const getFlagIcon = (currency: string): string => {
  return (
    CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG]?.flag || "💰"
  );
};

const RateCard = ({
  rate,
  fromCurrency,
  toCurrency,
}: {
  rate: number;
  fromCurrency: string;
  toCurrency: string;
}) => (
  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="text-2xl sm:text-3xl">{getFlagIcon(toCurrency)}</div>
      <div>
        <div className="flex items-center gap-1 sm:gap-2">
          <p className="text-sm sm:text-base font-semibold text-gray-800">
            1 {fromCurrency}
          </p>
          <RiExchangeFill size={14} className="text-gray-400" />
          <p className="text-sm sm:text-base font-semibold text-gray-800">
            {toCurrency}
          </p>
        </div>
      </div>
    </div>
    <div className="text-right">
      <p className="text-lg sm:text-2xl font-bold text-[#1d2087]">
        {formatCurrency(rate, toCurrency)}
      </p>
    </div>
  </div>
);

const ConversionRates = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["conversion-rates"],
    queryFn: getMarkups,
    staleTime: 5 * 60 * 1000,
  });

  const conversionRates = useMemo(() => {
    const markups = (data?.markups as MarkupData[]) || [];
    const ratesMap = new Map<string, MarkupData>();

    for (const item of markups) {
      const existing = ratesMap.get(item.currencyPair);

      if (item.currencyPair === "USD/JPY") {
        if (!existing) {
          ratesMap.set(item.currencyPair, item);
        } else {
          const existingScore = existing.tts > 0 ? 2 : existing.ttm > 0 ? 1 : 0;
          const currentScore = item.tts > 0 ? 2 : item.ttm > 0 ? 1 : 0;
          if (currentScore > existingScore) {
            ratesMap.set(item.currencyPair, item);
          }
        }
      } else if (!existing) {
        ratesMap.set(item.currencyPair, item);
      }
    }

    return Array.from(ratesMap.values()).map((item) => ({
      currencyPair: item.currencyPair,
      rate: getCalculatedRate(item),
    }));
  }, [data]);

  if (isLoading) return <SectionLoader />;
  if (isError)
    return (
      <SectionError
        error={error?.message || "Failed to load conversion rates"}
        action={refetch}
      />
    );
  if (conversionRates.length === 0) return null;

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
      <div className="w-full flex items-center gap-3">
        <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
          <RiMoneyDollarCircleFill size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm md:text-base font-semibold text-black uppercase">
            Currency Conversion Rates
          </p>
        </div>
      </div>

      <div className="w-full border-b border-black/6" />

      <div className="w-full space-y-3 sm:space-y-4">
        {conversionRates.map((rate) => {
          const [fromCurrency, toCurrency] = rate.currencyPair.split("/");
          return (
            <RateCard
              key={rate.currencyPair}
              rate={rate.rate}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConversionRates;
