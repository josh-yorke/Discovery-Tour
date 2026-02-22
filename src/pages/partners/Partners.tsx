import { useState, useEffect } from "react";
import Navbar from "../../components/nav/Navbar";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/pagination/Pagination";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import { useSearchParams } from "react-router-dom";
import { getPartners } from "../../hooks/partners/partners";
import PartnerSearch from "../../components/search/searchform/PartnerSearch";
import PartnersParent from "../../components/partners/PartnersParent";

const Partners = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const type = "insurance";

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);

    setSearchParams(params, { replace: true });
  }, [page, search, setSearchParams, isInitialized]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["partners", { page, search, type }],
    queryFn: () => getPartners({ page, search, type }),
    enabled: isInitialized,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    setPage(1);
  };

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
        <PartnerSearch
          searchValue={search}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && (
              <PartnersParent partners={data.partners} isLoading={isLoading} />
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

export default Partners;
