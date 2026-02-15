import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import { getTransports } from "../../hooks/transportation/transportation";
import { getTransportTypes } from "../../hooks/category/type";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import TransportationSearch from "../../components/search/searchform/TransportationSearch";
import TransportationParent from "../../components/transportation/Transportation";
import { useSearchParams } from "react-router-dom";

const Transportation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlCountry = searchParams.get("country") || "";
    const urlType = searchParams.get("type") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setCountry(urlCountry);
    setType(urlType);
    setIsInitialized(true);
  }, []);

  // Update URL when state changes (but not on initial mount)
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (country) params.set("country", country);
    if (type) params.set("type", type);

    setSearchParams(params, { replace: true });
  }, [page, search, country, type, setSearchParams, isInitialized]);

  const { data: countriesData } = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
    select: (data) => {
      if (!data?.countries) return [];
      return data.countries.filter(
        (country): country is string => typeof country === "string",
      );
    },
  });

  const { data: typeData } = useQuery({
    queryKey: ["transportType"],
    queryFn: getTransportTypes,
    select: (data) => {
      if (!data?.types) return [];
      return data.types.filter(
        (type): type is string => typeof type === "string",
      );
    },
  });

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["transports", { page, search, country, type }],
    queryFn: () => getTransports({ page, search, country, type }),
    enabled: isInitialized,
  });

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
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

  const countries = useMemo(() => countriesData || [], [countriesData]);
  const types = useMemo(() => typeData || [], [typeData]);

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <TransportationSearch
          searchValue={search}
          countryValue={country}
          typeValue={type}
          onSearchChange={handleSearchChange}
          onCountryChange={handleCountryChange}
          onTypeChange={handleTypeChange}
          onSearchSubmit={handleSearchSubmit}
          countries={countries}
          types={types}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && (
              <TransportationParent
                transportations={data.transports}
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

export default Transportation;
