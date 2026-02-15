import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { getVehicles } from "../../hooks/vehicles/vehicles";
import VehicleSearch from "../../components/search/searchform/VehicleSearch";
import VehicleParent from "../../components/vehicles/VehicleParent";
import { useSearchParams } from "react-router-dom";

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlAvailability = searchParams.get("isAvailable") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setStatus(urlStatus);
    setAvailability(urlAvailability);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (availability) params.set("isAvailable", availability);

    setSearchParams(params, { replace: true });
  }, [page, search, status, availability, setSearchParams, isInitialized]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["vehicles", { page, search, status, isAvailable: availability }],
    queryFn: () =>
      getVehicles({
        page,
        search,
        status,
        isAvailable: availability,
      }),
    enabled: isInitialized,
  });

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);
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

  const availabilityOptions = ["true", "false"];
  const statusOptions = ["active", "maintenance", "unavailable"];

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <VehicleSearch
          searchValue={search}
          statusValue={status}
          availabilityValue={availability}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onAvailabilityChange={handleAvailabilityChange}
          onSearchSubmit={handleSearchSubmit}
          statuses={statusOptions}
          availability={availabilityOptions}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && (
              <VehicleParent vehicles={data.vehicles} isLoading={isLoading} />
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

export default Vehicles;
