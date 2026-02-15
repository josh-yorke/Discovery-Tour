import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getVisas,
  getVisaTypes,
  getVisaCountries,
} from "../../hooks/visa/visa/getVisas";
import Navbar from "../../components/nav/Navbar";
import VisaParent from "../../components/visa/visa/VisaParent";
import Pagination from "../../components/pagination/Pagination";
import VisaSearch from "../../components/search/searchform/VisaSearch";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { useSearchParams } from "react-router-dom";

const Visas = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL on component mount
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from URL - this runs once on mount
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
  }, []); // Empty dependency array - runs once on mount

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

  const { data: visaTypesData } = useQuery({
    queryKey: ["visaTypes"],
    queryFn: getVisaTypes,
  });

  const { data: countriesData } = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
  });

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["visas", { page, search, country, type }],
    queryFn: () => getVisas({ page, search, country, type }),
    enabled: isInitialized, // Only run query after initialization
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

  const types =
    visaTypesData?.visaTypes?.filter(
      (t): t is string => typeof t === "string",
    ) || [];
  const countries =
    countriesData?.countries?.filter(
      (c): c is string => typeof c === "string",
    ) || [];

  // Don't render until initialized
  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <VisaSearch
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
            {data && <VisaParent visas={data.visas} isLoading={isLoading} />}
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

export default Visas;
