import { useState, useEffect } from "react";
import Navbar from "../../components/nav/Navbar";
import PromotionsSearch from "../../components/search/searchform/PromotionsSearch";
import { useQuery } from "@tanstack/react-query";
import { getPromotions } from "../../hooks/promotions/getPromotions";
import Pagination from "../../components/pagination/Pagination";
import PromotionsParent from "../../components/promotions/PromotionsParent";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { useSearchParams } from "react-router-dom";

const Promotions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setStatus(urlStatus);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    setSearchParams(params, { replace: true });
  }, [page, search, status, setSearchParams, isInitialized]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["promotions", { page, search, status }],
    queryFn: () => getPromotions({ page, search, status }),
    enabled: isInitialized,
  });

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Don't render until initialized
  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-svh px-6 py-12 gap-12">
        <PromotionsSearch
          searchValue={search}
          statusValue={status}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onSearchSubmit={handleSearchSubmit}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && (
              <PromotionsParent
                promotions={data.promotions}
                isLoading={isLoading}
              />
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

export default Promotions;
