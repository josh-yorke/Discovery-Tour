import { useState, useEffect } from "react";
import Navbar from "../../components/nav/Navbar";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/pagination/Pagination";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import { useSearchParams } from "react-router-dom";
import { getPageConfigs } from "../../hooks/page-config/pageConfig";
import PageConfigsSearch from "../../components/search/searchform/PageConfigsSearch";
import PageConfigsParent from "../../components/page-config/PageConfigParent";

const PageConfigs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [types, setTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlTypes =
      searchParams.get("types")?.split(",").filter(Boolean) || [];

    setPage(urlPage);
    setTypes(urlTypes);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (types.length > 0) params.set("types", types.join(","));

    setSearchParams(params, { replace: true });
  }, [page, types, setSearchParams, isInitialized]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["pageConfigs", { page, types }],
    queryFn: () => getPageConfigs(page.toString(), types),
    enabled: isInitialized,
  });

  const handleTypesChange = (value: string[]) => {
    setTypes(value);
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
        <PageConfigsSearch
          typesValue={types}
          onTypesChange={handleTypesChange}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            {data && (
              <PageConfigsParent configs={data.configs} isLoading={isLoading} />
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

export default PageConfigs;
