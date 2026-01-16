import { useState, useEffect, useCallback } from "react";
import ImageCard from "../../../../components/cards/ImageCard";
import LinkText from "../../../../components/nav/LinkText";

interface CountryInfo {
  flag: string;
  embassy: string;
}

interface VisaData {
  country: string;
  eligibleApplicants: string;
  images: string[];
  mainDescription: string;
  type: string;
  _id: string;
}

interface InformationSectionProps {
  visaData: VisaData;
  countryInfo: CountryInfo;
  selectedCountry: string;
  selectedVisaType: string;
}

const flagCache = new Map<string, string>();

const countryCodeMap: Record<string, string> = {
  "united states": "us",
  usa: "us",
  america: "us",
  canada: "ca",
  mexico: "mx",
  brazil: "br",
  argentina: "ar",
  chile: "cl",
  peru: "pe",
  colombia: "co",
  "united kingdom": "gb",
  uk: "gb",
  "great britain": "gb",
  france: "fr",
  germany: "de",
  italy: "it",
  spain: "es",
  portugal: "pt",
  netherlands: "nl",
  holland: "nl",
  belgium: "be",
  switzerland: "ch",
  austria: "at",
  sweden: "se",
  norway: "no",
  denmark: "dk",
  finland: "fi",
  russia: "ru",
  ukraine: "ua",
  poland: "pl",
  "czech republic": "cz",
  czech: "cz",
  hungary: "hu",
  greece: "gr",
  turkey: "tr",
  china: "cn",
  japan: "jp",
  "south korea": "kr",
  korea: "kr",
  india: "in",
  singapore: "sg",
  malaysia: "my",
  thailand: "th",
  vietnam: "vn",
  indonesia: "id",
  philippines: "ph",
  "saudi arabia": "sa",
  uae: "ae",
  "united arab emirates": "ae",
  qatar: "qa",
  australia: "au",
  "new zealand": "nz",
  "south africa": "za",
  egypt: "eg",
  nigeria: "ng",
  kenya: "ke",
  ethiopia: "et",
  morocco: "ma",
};

const getCountryCode = (countryName: string): string => {
  const normalized = countryName.toLowerCase().trim();

  if (countryCodeMap[normalized]) {
    return countryCodeMap[normalized];
  }

  for (const [key, code] of Object.entries(countryCodeMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return code;
    }
  }

  return normalized.slice(0, 2);
};

const getFlagUrl = (countryName: string): string => {
  const countryCode = getCountryCode(countryName).toLowerCase();

  if (flagCache.has(countryCode)) {
    return flagCache.get(countryCode)!;
  }

  const flagUrl = `https://flagcdn.com/w320/${countryCode}.png`;
  flagCache.set(countryCode, flagUrl);

  return flagUrl;
};

const Information = ({
  visaData,
  countryInfo,
  selectedCountry,
}: InformationSectionProps) => {
  const [flagUrl, setFlagUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const loadFlag = useCallback(() => {
    if (!visaData?.country) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const url = getFlagUrl(visaData.country);
    setFlagUrl(url);

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      flagCache.set(getCountryCode(visaData.country).toLowerCase(), url);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = url;
  }, [visaData?.country]);

  useEffect(() => {
    loadFlag();
  }, [loadFlag]);

  const countryInitials = visaData?.country
    ? visaData.country
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <>
      <ImageCard url={visaData.images} style="w-full aspect-2/1 rounded-lg" />
      <div
        className="w-full bg-white p-6 rounded-lg flex flex-col items-center gap-4"
        id="information"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            {isLoading && (
              <div className="w-30 h-20 bg-gray-200 rounded animate-pulse border border-black/6" />
            )}

            <img
              src={flagUrl}
              alt={`${selectedCountry} flag`}
              width={120}
              className={`border border-black/6 ${
                isLoading ? "opacity-0 absolute" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
            />

            {hasError && !isLoading && (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 border border-gray-300 rounded">
                <span className="text-gray-700 font-bold text-lg">
                  {countryInitials}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xl font-semibold text-black uppercase">
              {visaData.country}
            </p>
            <LinkText
              title="Embassy Link"
              url={countryInfo.embassy}
              style="font-semibold text-[#1d2087] hover:text-[#393ca3]"
            />
          </div>
        </div>

        <div className="w-full border-b border-black/6" />

        <div className="w-full flex flex-col gap-2">
          <p className="text-base font-semibold text-[#1d2087]">Visa Type</p>
          <p className="text-sm font-normal">{visaData.type}</p>
        </div>

        <div className="w-full border-b border-black/6" />

        <div className="w-full flex flex-col gap-2">
          <p className="text-base font-semibold text-[#1d2087]">
            Visa Description
          </p>
          <pre className="text-sm font-normal text-gray-800 whitespace-pre-wrap font-sans">
            {visaData.mainDescription}
          </pre>
        </div>

        <div className="w-full border-b border-black/6" />

        <div className="w-full flex flex-col gap-2">
          <p className="text-base font-semibold text-[#1d2087]">
            Eligible Applicants
          </p>
          <pre className="text-sm font-normal text-gray-800 whitespace-pre-wrap font-sans">
            {visaData.eligibleApplicants}
          </pre>
        </div>
      </div>
    </>
  );
};

export default Information;
