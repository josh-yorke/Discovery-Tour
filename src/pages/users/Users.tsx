import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/nav/Navbar";
import { getUsers } from "../../hooks/users/getUsers";
import { useState, useEffect, useRef } from "react";
import UsersSearch from "../../components/search/searchform/UsersSearch";
import Pagination from "../../components/pagination/Pagination";
import UsersParent from "../../components/users/UsersParent";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import { useSearchParams } from "react-router-dom";

// Custom debounce hook built directly in the file
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLoadDone = useRef(false);

  // Local state for inputs
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Debounce search input (500ms delay)
  const debouncedSearch = useDebounce(searchInput, 500);

  // Initialize from URL - runs once on mount
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlRole = searchParams.get("role") || "";

    setPage(urlPage);
    setSearchInput(urlSearch);
    setStatus(urlStatus);
    setRole(urlRole);
    setIsInitialized(true);
    initialLoadDone.current = true;
  }, []);

  // Update URL when debounced values change (not on every keystroke)
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.set("status", status);
    if (role) params.set("role", role);

    const newParams = params.toString();
    const oldParams = searchParams.toString();

    // Only update if params have actually changed
    if (newParams !== oldParams) {
      setSearchParams(params, { replace: true });
    }
  }, [
    page,
    debouncedSearch,
    status,
    role,
    setSearchParams,
    isInitialized,
    searchParams,
  ]);

  // Query uses debounced search to prevent too many requests
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["users", page, debouncedSearch, status, role],
    queryFn: () =>
      getUsers({
        page,
        search: debouncedSearch,
        status,
        role,
      }),
    enabled: isInitialized,
    staleTime: 30000, // Data stays fresh for 30 seconds
    gcTime: 60000, // Keep in cache for 60 seconds
    refetchOnWindowFocus: false, // Don't refetch when tab gains focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    retry: 1, // Only retry once on failure
  });

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // Don't reset page here - wait for debounce
  };

  const handleSearchSubmit = () => {
    // Force immediate search on Enter/button click
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
        <UsersSearch
          searchValue={searchInput}
          statusValue={status}
          roleValue={role}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onRoleChange={handleRoleChange}
          onSearchSubmit={handleSearchSubmit}
        />

        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && <UsersParent users={data.users} isLoading={isLoading} />}
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

export default Users;
