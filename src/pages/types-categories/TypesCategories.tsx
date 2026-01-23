import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useState, useCallback } from "react";
import Navbar from "../../components/nav/Navbar";
import Pagination from "../../components/pagination/Pagination";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import {
  rentalSearchSchema,
  type rentalSearchData,
} from "../../types/rental/rentalSearchTypes";
import { getTypesCategories } from "../../hooks/types-categories/typesCategories";
import RentalSearch from "../../components/search/searchform/RentalSearch";
import RentalParent from "../../components/rental/RentalParent";
import TypesCategoriesSearch from "../../components/search/searchform/TypesCategoriesSearch";
import {
  typesCategoriesSearchSchema,
  type typesCategoriesSearchData,
} from "../../types/types-categories/typesCategoriesSearchTypes";
import TypesCategoriesParent from "../../components/types-categories/TypesCategoriesParent";

const TypesCategories = () => {
  const { register, handleSubmit, setValue, getValues, watch } = useForm<
    z.input<typeof typesCategoriesSearchSchema>
  >({
    resolver: zodResolver(typesCategoriesSearchSchema),
    defaultValues: {
      service: "visa-type",
    },
  });

  const [searchParams, setSearchParams] = useState<typesCategoriesSearchData>({
    service: "visa-type",
  });

  const onSubmit = (data: z.input<typeof typesCategoriesSearchSchema>) => {
    setSearchParams({ ...data });
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
          services={[
            "visa",
            "tour",
            "transport",
            "pass",
            "pass-category",
            "country",
          ]}
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
          </>
        )}
      </div>
    </>
  );
};

export default TypesCategories;
