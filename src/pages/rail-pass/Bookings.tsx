import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../../hooks/rail-passes/passBooking";
import BookingSearch from "../../components/search/searchform/BookingSearch";
import BookingParent from "../../components/rail-pass/BookingParent";

const Bookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [railpass, setRailpass] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlRailpass = searchParams.get("railpass") || "";
    const urlMonth = searchParams.get("month") || "";
    const urlDay = searchParams.get("day") || "";
    const urlYear = searchParams.get("year") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setStatus(urlStatus);
    setRailpass(urlRailpass);
    setMonth(urlMonth);
    setDay(urlDay);
    setYear(urlYear);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (railpass) params.set("railpass", railpass);
    if (month) params.set("month", month);
    if (day) params.set("day", day);
    if (year) params.set("year", year);

    setSearchParams(params, { replace: true });
  }, [
    page,
    search,
    status,
    railpass,
    month,
    day,
    year,
    setSearchParams,
    isInitialized,
  ]);

  const fetchBookings = useCallback(async () => {
    return await getBookings({
      page,
      search,
      status,
      railpass,
      month,
      day,
      year,
    });
  }, [page, search, status, railpass, month, day, year]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: [
      "railBookings",
      { page, search, status, railpass, month, day, year },
    ],
    queryFn: fetchBookings,
    enabled: isInitialized,
  });

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleRailpassChange = (railpassId: string) => {
    setRailpass(railpassId);
    setPage(1);
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
    setPage(1);
  };

  const handleDayChange = (value: string) => {
    setDay(value);
    setPage(1);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
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

  const statuses = ["pending", "confirmed", "cancelled", "completed"];

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <BookingSearch
          searchValue={search}
          statusValue={status}
          monthValue={month}
          dayValue={day}
          yearValue={year}
          railpassValue={railpass}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onMonthChange={handleMonthChange}
          onDayChange={handleDayChange}
          onYearChange={handleYearChange}
          onRailpassChange={handleRailpassChange}
          onSearchSubmit={handleSearchSubmit}
          statuses={statuses}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            <BookingParent bookings={data?.booking} isLoading={isLoading} />
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

export default Bookings;
