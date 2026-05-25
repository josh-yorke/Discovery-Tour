import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Navbar from "../../components/nav/Navbar";
import TypesCategoriesSearch from "../../components/search/searchform/TypesCategoriesSearch";
import TypesCategoriesParent from "../../components/types-categories/TypesCategoriesParent";
import { TYPES_CATEGORIES_OPTIONS } from "../../constants/typesCategoriesConstants";
import { getTypesCategories } from "../../hooks/types-categories/typesCategories";
import Pagination from "../../components/pagination/Pagination";

const TypesCategories = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const rawType = urlParams.get("type");
  const type =
    rawType && TYPES_CATEGORIES_OPTIONS.includes(rawType) ? rawType : null;

  const [service, setService] = useState(type || "visa");
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(urlParams.get("page") || "1");
    const urlService = urlParams.get("type") || "visa";

    setPage(urlPage);
    setService(urlService);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (service && service !== "visa") params.set("type", service);

    navigate({ search: params.toString() }, { replace: true });
  }, [page, service, navigate, isInitialized]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["typesCategories", { service, page }],
    queryFn: () => getTypesCategories({ service, page }),
    enabled: isInitialized,
  });

  const handleServiceChange = (value: string) => {
    setService(value);
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
        <TypesCategoriesSearch
          serviceValue={service}
          onServiceChange={handleServiceChange}
          services={TYPES_CATEGORIES_OPTIONS}
        />

        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            <TypesCategoriesParent
              type={service}
              typeCategories={data?.typesCategories}
              isLoading={isLoading}
              refetch={refetch}
              currentPage={page}
              onPageChange={handlePageChange}
              totalPages={data?.totalPages || 1}
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

export default TypesCategories;
