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
  vehicleSearchSchema,
  type vehicleSearchData,
} from "../../types/vehicles/vehicleSearchTypes";
import { getVehicles } from "../../hooks/vehicles/vehicles";
import VehicleSearch from "../../components/search/searchform/VehicleSearch";
import VehicleParent from "../../components/vehicles/VehicleParent";

const Vehicles = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    z.input<typeof vehicleSearchSchema>
  >({
    resolver: zodResolver(vehicleSearchSchema),
    defaultValues: {
      page: 1,
      search: "",
      isAvailable: "",
      status: "",
    },
  });

  const [searchParams, setSearchParams] = useState<vehicleSearchData>({
    page: 1,
    search: "",
    isAvailable: "",
    status: "",
  });

  const onSubmit = (data: z.input<typeof vehicleSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const fetchVehicles = useCallback(async () => {
    return await getVehicles(searchParams);
  }, [searchParams]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["vehicles", searchParams],
    queryFn: fetchVehicles,
    enabled: true,
  });

  const handlePageChange = (page: number) => {
    const values = getValues();
    setValue("page", page);
    setSearchParams({
      ...values,
      page,
    });
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <VehicleSearch
          availability={["true", "false"]}
          statuses={["active", "maintenance", "unavailable"]}
          status={register("status")}
          isAvailable={register("isAvailable")}
          search={register("search")}
          action={handleSubmit(onSubmit)}
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

export default Vehicles;
