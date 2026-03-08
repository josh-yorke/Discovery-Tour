import { useState, useEffect, useCallback } from "react";
import {
  RiDeleteBin4Fill,
  RiInformationFill,
  RiPencilFill,
} from "react-icons/ri";
import type { visaData } from "../../../../types/visa/visaDataTypes";
import Documents from "../../../../pages/visa/view/sections/Documents";
import Processes from "../../../../pages/visa/view/sections/Processes";
import Pricelists from "../../../../pages/visa/view/sections/Pricelists";
import Terms from "../../../../pages/visa/view/sections/Terms";
import Payments from "../../../../pages/visa/view/sections/Payments";
import IconButton from "../../../button/IconButton";
import Faqs from "../../../../pages/visa/view/sections/Faqs";

interface ViewProps extends visaData {
  savedAt: string;
  onDelete: (_id: string) => void;
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

const View = ({
  _id,
  mainDescription,
  eligibleApplicants,
  type,
  country,
  onDelete,
}: ViewProps) => {
  const [flagUrl, setFlagUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const loadFlag = useCallback(() => {
    if (!country) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const url = getFlagUrl(country);
    setFlagUrl(url);

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      flagCache.set(getCountryCode(country).toLowerCase(), url);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = url;
  }, [country]);

  useEffect(() => {
    loadFlag();
  }, [loadFlag]);

  const countryInitials = country
    ? country
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <>
      <div className="w-full flex flex-col gap-12 ">
        <div className="w-full flex flex-row gap-2">
          <IconButton
            style="px-3 py-2 rounded-full bg-gray-200"
            action={() => {
              window.open(`/visas/visa/edit/${_id}`, "_blank");
            }}
            title="Edit"
            icon={<RiPencilFill size={16} />}
          />
          <IconButton
            style="px-3 py-2 rounded-full bg-gray-200"
            action={() => onDelete(_id)}
            title="Delete"
            icon={<RiDeleteBin4Fill size={16} />}
          />
        </div>
        <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-full flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
              <RiInformationFill size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-black uppercase">
                Country Information
              </p>
            </div>
          </div>

          <div className="w-full border-b border-black/6" />

          <div className="w-full flex items-center justify-center gap-6">
            <div className="relative">
              {isLoading && (
                <div className="w-30 h-20 bg-gray-200 rounded animate-pulse border border-black/6" />
              )}

              <img
                src={flagUrl}
                alt={`${country} flag`}
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
                {country}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-full flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
              <RiInformationFill size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-black uppercase">
                Visa Type
              </p>
            </div>
          </div>

          <div className="w-full border-b border-black/6" />

          <div className="w-full">
            <p className="text-sm font-normal text-gray-800">{type}</p>
          </div>
        </div>

        <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-full flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
              <RiInformationFill size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-black uppercase">
                Visa Description
              </p>
            </div>
          </div>

          <div className="w-full border-b border-black/6" />

          <div className="w-full">
            <pre className="text-sm font-normal text-gray-800 whitespace-pre-wrap font-sans">
              {mainDescription}
            </pre>
          </div>
        </div>

        <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-full flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
              <RiInformationFill size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-black uppercase">
                Eligible Applicants
              </p>
            </div>
          </div>

          <div className="w-full border-b border-black/6" />

          <div className="w-full">
            <pre className="text-sm font-normal text-gray-800 whitespace-pre-wrap font-sans">
              {eligibleApplicants}
            </pre>
          </div>
        </div>

        <Documents visaId={_id} />
        <Processes visaId={_id} />
        <Pricelists visaId={_id} />
        <Terms visaId={_id} />
        <Payments visaId={_id} />
        <Faqs idType="visaId" id={_id} />
      </div>
    </>
  );
};

export default View;
