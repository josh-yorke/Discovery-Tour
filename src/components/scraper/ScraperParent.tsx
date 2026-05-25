import SectionLoader from "../loader/SectionLoader";
import type { ScrapedData } from "../../types/scraper/scrapedDataTypes";
import ScrapedDataCard from "../cards/ScrapedDataCard";

interface ParentProps {
  scrapedData: ScrapedData[];
  isLoading: boolean;
}

const ScraperParent = ({ scrapedData, isLoading }: ParentProps) => {
  if (isLoading) return <SectionLoader />;

  return (
    <>
      {scrapedData && scrapedData.length > 0 ? (
        <div className="w-full lg:w-9/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scrapedData.map((scrapedData: ScrapedData) => (
            <ScrapedDataCard
              _id={scrapedData._id}
              currencyPair={scrapedData.currencyPair}
              ttb={scrapedData.ttb}
              ttm={scrapedData.ttm}
              tts={scrapedData.tts}
              createdAt={scrapedData.createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal">No Results Found</p>
        </div>
      )}
    </>
  );
};

export default ScraperParent;
