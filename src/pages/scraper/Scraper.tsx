import { useState, useEffect } from "react";
import Navbar from "../../components/nav/Navbar";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/pagination/Pagination";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import { useSearchParams } from "react-router-dom";
import ScraperSearch from "../../components/search/searchform/ScraperSearch";
import { getScrapedData } from "../../hooks/scraper/scraper";
import ScraperParent from "../../components/scraper/ScraperParent";

const Scraper = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");

    setPage(urlPage);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());

    setSearchParams(params, { replace: true });
  }, [page, status, setSearchParams, isInitialized]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["scraped-data", { page, status }],
    queryFn: () => getScrapedData(page, 10),
    enabled: isInitialized,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-svh px-6 py-12 gap-12">
        <ScraperSearch />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && (
              <ScraperParent scrapedData={data.rates} isLoading={isLoading} />
            )}
            {data?.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={data?.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Scraper;
