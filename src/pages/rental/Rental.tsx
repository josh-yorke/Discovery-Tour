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
import { getRentals } from "../../hooks/rental/rental";
import RentalSearch from "../../components/search/searchform/RentalSearch";
import RentalParent from "../../components/rental/RentalParent";

const Rental = () => {
  const { register, handleSubmit, setValue, getValues, watch } = useForm<
    z.input<typeof rentalSearchSchema>
  >({
    resolver: zodResolver(rentalSearchSchema),
    defaultValues: {
      page: 1,
      search: "",
      vehicle: "",
      year: "",
      month: "",
      day: "",
      status: "",
    },
  });

  const [searchParams, setSearchParams] = useState<rentalSearchData>({
    page: 1,
    search: "",
    vehicle: "",
    year: "",
    month: "",
    day: "",
    status: "",
  });

  const onSubmit = (data: z.input<typeof rentalSearchSchema>) => {
    setSearchParams({ ...data, page: 1 });
    setValue("page", 1);
  };

  const handleVehicleChange = (vehicleId: string) => {
    setValue("vehicle", vehicleId);
  };

  const fetchRentals = useCallback(async () => {
    return await getRentals(searchParams);
  }, [searchParams]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["rentals", searchParams],
    queryFn: fetchRentals,
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

  const vehicleValue = watch("vehicle") || "";

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-6 py-12 gap-12">
        <RentalSearch
          status={register("status")}
          day={register("day")}
          month={register("month")}
          year={register("year")}
          vehicle={register("vehicle")}
          search={register("search")}
          action={handleSubmit(onSubmit)}
          statuses={[
            "pending",
            "confirmed",
            "awaiting payment",
            "paid",
            "ongoing",
            "completed",
            "cancelled",
          ]}
          onVehicleChange={handleVehicleChange}
          vehicleValue={vehicleValue}
        />
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          <>
            <RentalParent rentals={data?.rentals} isLoading={isLoading} />
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

export default Rental;
