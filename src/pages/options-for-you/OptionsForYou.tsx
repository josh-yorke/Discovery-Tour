import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { getOptionBookings } from "../../hooks/options/options";
import OptionsForYouSearch from "../../components/search/searchform/OptionsForYouSearch";
import OptionsForYouParent from "../../components/options-for-you/OptionsForYouParent";

const statuses = [
  "pending",
  "confirmed",
  "awaiting payment",
  "paid",
  "ongoing",
  "completed",
  "cancelled",
];

const OptionsForYou = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlStatus = searchParams.get("status") || "";
    const urlSearch = searchParams.get("search") || "";

    setPage(urlPage);
    setStatus(urlStatus);
    setSearch(urlSearch);
    setIsInitialized(true);
  }, [searchParams]);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (status) params.set("status", status);
    if (search) params.set("search", search);

    setSearchParams(params, { replace: true });
  }, [page, status, search, setSearchParams, isInitialized]);

  const fetchOptionBookings = useCallback(async () => {
    return await getOptionBookings(page, status, search);
  }, [page, status, search]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["option-bookings", { page, status, search }],
    queryFn: fetchOptionBookings,
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

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <OptionsForYouSearch
          searchValue={search}
          statusValue={status}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onSearchSubmit={handleSearchSubmit}
          statuses={statuses}
        />

        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            <OptionsForYouParent
              bookings={data?.bookings}
              isLoading={isLoading}
            />
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

export default OptionsForYou;
