import { useState, useEffect } from "react";
import Navbar from "../../components/nav/Navbar";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/pagination/Pagination";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import { useSearchParams } from "react-router-dom";
import { getAllCareers } from "../../hooks/careers/careers";
import CareersSearch from "../../components/search/searchform/CareersSearch";
import CareersParent from "../../components/careers/CareersParent";

const Careers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [branch, setBranch] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlEmploymentType = searchParams.get("employmentType") || "";
    const urlBranch = searchParams.get("branch") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setStatus(urlStatus);
    setEmploymentType(urlEmploymentType);
    setBranch(urlBranch);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (employmentType) params.set("employmentType", employmentType);
    if (branch) params.set("branch", branch);

    setSearchParams(params, { replace: true });
  }, [
    page,
    search,
    status,
    employmentType,
    branch,
    setSearchParams,
    isInitialized,
  ]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["careers", { page, search, status, employmentType, branch }],
    queryFn: () =>
      getAllCareers({ page, search, status, employmentType, branch }),
    enabled: isInitialized,
  });

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleEmploymentTypeChange = (value: string) => {
    setEmploymentType(value);
    setPage(1);
  };

  const handleBranchChange = (value: string) => {
    setBranch(value);
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

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setEmploymentType("");
    setBranch("");
    setPage(1);
  };

  if (!isInitialized) {
    return <SectionLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-svh px-6 py-12 gap-12">
        <CareersSearch
          searchValue={search}
          statusValue={status}
          employmentTypeValue={employmentType}
          branchValue={branch}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onEmploymentTypeChange={handleEmploymentTypeChange}
          onBranchChange={handleBranchChange}
          onSearchSubmit={handleSearchSubmit}
          onClearFilters={handleClearFilters}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && <CareersParent careers={data} isLoading={isLoading} />}
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

export default Careers;
