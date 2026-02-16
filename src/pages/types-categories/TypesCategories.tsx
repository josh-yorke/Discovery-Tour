import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Navbar from "../../components/nav/Navbar";
import TypesCategoriesSearch from "../../components/search/searchform/TypesCategoriesSearch";
import TypesCategoriesParent from "../../components/types-categories/TypesCategoriesParent";
import { TYPES_CATEGORIES_OPTIONS } from "../../constants/typesCategoriesConstants";
import { getTypesCategories } from "../../hooks/types-categories/typesCategories";
import {
  typesCategoriesSearchSchema,
  type typesCategoriesSearchData,
} from "../../types/types-categories/typesCategoriesSearchTypes";
import { useLocation } from "react-router";
import Pagination from "../../components/pagination/Pagination";

const TypesCategories = () => {
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const rawType = urlParams.get("type");
  const type =
    rawType && TYPES_CATEGORIES_OPTIONS.includes(rawType) ? rawType : null;

  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof typesCategoriesSearchSchema>
  >({
    resolver: zodResolver(typesCategoriesSearchSchema),
    defaultValues: {
      service: type || "visa",
      page: 1,
    },
  });

  const [searchParams, setSearchParams] = useState<typesCategoriesSearchData>({
    service: type || "visa",
    page: 1,
  });

  const onSubmit = (data: z.input<typeof typesCategoriesSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const handlePageChange = (page: number) => {
    const values = getValues();
    setValue("page", page);
    setSearchParams({
      ...values,
      page,
    });
  };

  const fetchTypesCategories = useCallback(async () => {
    return await getTypesCategories(searchParams);
  }, [searchParams]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["typesCategories", searchParams],
    queryFn: fetchTypesCategories,
    enabled: true,
  });

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <TypesCategoriesSearch
          service={register("service")}
          action={handleSubmit(onSubmit)}
          services={TYPES_CATEGORIES_OPTIONS}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            <TypesCategoriesParent
              type={searchParams.service}
              typeCategories={data?.typesCategories}
              isLoading={isLoading}
            />
            {data?.totalPages > 1 && (
              <Pagination
                currentPage={searchParams.page ?? 1}
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
