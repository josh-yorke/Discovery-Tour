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

const Information = ({
  visaData,
  countryInfo,
  selectedCountry,
}: InformationSectionProps) => {
  return (
    <>
      <ImageCard url={visaData.images} style="w-full aspect-2/1 rounded-lg" />
      <div
        className="w-full bg-white p-6 rounded-lg flex flex-col items-center gap-4"
        id="information"
      >
        <div className="flex items-center gap-6">
          <img
            src={countryInfo.flag}
            alt={`${selectedCountry} flag`}
            width={120}
            className="border border-black/6"
          />
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
