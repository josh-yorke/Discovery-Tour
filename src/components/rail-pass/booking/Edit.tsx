import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
  addRailBookingSchema,
  type addRailBookingData,
} from "../../../types/rail-pass/addBookingTypes";
import Input from "../../input/Input";
import InputOption from "../../input/InputOption";
import Button from "../../button/Button";
import SearchableRailPassDropdown from "../../input/SearchableRailPassDropdown";
import SearchableRailPlanDropdown from "../../input/SearchableRailPlanDropdown";
import { updateBooking } from "../../../hooks/rail-passes/passBooking";
import DatePicker from "../../input/DatePicker";
import DestinationsInput from "../../input/DestinationsInput";

interface EditProps extends addRailBookingData {
  id?: string;
}

const Edit = ({
  id: propId,
  railpass,
  plan,
  customer,
  travel,
  remarks,
  status,
}: EditProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const railpassId = propId || routeId || "";

  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const methods = useForm<addRailBookingData>({
    resolver: zodResolver(addRailBookingSchema),
    defaultValues: {
      railpass: railpass || "",
      plan: plan || "",
      customer: {
        fullName: customer?.fullName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        nationality: customer?.nationality || "",
        passportNumber: customer?.passportNumber || "",
      },
      travel: {
        dateFrom: "",
        dateTo: "",
        numberOfAdults: travel?.numberOfAdults || 1,
        numberOfChildren: travel?.numberOfChildren || 0,
        destinations: travel?.destinations || [],
        iteneraryDescription: travel?.iteneraryDescription || "",
      },
      remarks: remarks || "",
      status: status || "pending",
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (travel) {
      setValue("travel.dateFrom", formatDateForInput(travel.dateFrom || ""));
      setValue("travel.dateTo", formatDateForInput(travel.dateTo || ""));
    }
  }, [travel, setValue]);

  const mutation = useMutation({
    mutationFn: (data: addRailBookingData) => updateBooking(railpassId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["railBookings"],
        exact: false,
      });
      navigate(-1);
    },
  });

  const onSubmit = (data: addRailBookingData) => {
    mutation.mutate(data);
  };

  const railpassValue = watch("railpass") || "";
  const planValue = watch("plan") || "";

  const getCustomerError = (
    field: keyof NonNullable<addRailBookingData["customer"]>,
  ): string => {
    return errors.customer?.[field]?.message?.toString() || "";
  };

  const getTravelError = (
    field: keyof NonNullable<addRailBookingData["travel"]>,
  ): string => {
    return errors.travel?.[field]?.message?.toString() || "";
  };

  const customerFields = [
    {
      name: "customer.fullName" as const,
      title: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      error: getCustomerError("fullName"),
    },
    {
      name: "customer.email" as const,
      title: "Email",
      type: "email",
      placeholder: "Enter email address",
      error: getCustomerError("email"),
    },
    {
      name: "customer.phone" as const,
      title: "Phone",
      type: "tel",
      placeholder: "Enter phone number",
      error: getCustomerError("phone"),
    },
    {
      name: "customer.nationality" as const,
      title: "Nationality",
      type: "text",
      placeholder: "Enter nationality",
      error: getCustomerError("nationality"),
    },
    {
      name: "customer.passportNumber" as const,
      title: "Passport Number",
      type: "text",
      placeholder: "Enter passport number",
      error: getCustomerError("passportNumber"),
    },
  ];

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
        className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      >
        <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
          <SearchableRailPassDropdown
            disabled={false}
            title="Railpass"
            value={railpassValue}
            onChange={(railpassId: string) =>
              setValue("railpass", railpassId, { shouldValidate: true })
            }
            placeholder="Search for a railpass..."
          />

          <SearchableRailPlanDropdown
            disabled={false}
            title="Plan"
            value={planValue}
            railPassId={railpassValue}
            onChange={(planId: string) => {
              setValue("plan", planId, { shouldValidate: true });
            }}
            placeholder="Search for a plan..."
            error={errors.plan?.message || ""}
          />

          {customerFields.map((field) => (
            <Input
              key={field.name}
              style="bg-white"
              disabled={false}
              error={field.error}
              title={field.title}
              placeholder={field.placeholder}
              type={field.type}
              {...register(field.name)}
            />
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              style="bg-white"
              disabled={false}
              error={getTravelError("dateFrom")}
              title="Travel Start Date"
              placeholder="Select start date"
              name="travel.dateFrom"
              compareField="travel.dateTo"
              comparisonType="before"
            />

            <DatePicker
              style="bg-white"
              disabled={false}
              error={getTravelError("dateTo")}
              title="Travel End Date"
              placeholder="Select end date"
              name="travel.dateTo"
              compareField="travel.dateFrom"
              comparisonType="after"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={getTravelError("numberOfAdults")}
              title="Number of Adults"
              placeholder="Enter number of adults"
              type="number"
              {...register("travel.numberOfAdults", { valueAsNumber: true })}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={getTravelError("numberOfChildren")}
              title="Number of Children"
              placeholder="Enter number of children"
              type="number"
              {...register("travel.numberOfChildren", { valueAsNumber: true })}
            />
          </div>

          <DestinationsInput
            disabled={false}
            error={getTravelError("destinations")}
            title="Destinations"
            placeholder="Enter destinations (comma separated, e.g., Tokyo, Kyoto, Osaka)"
            value={watch("travel.destinations") || []}
            onChange={(destinationsArray) =>
              setValue("travel.destinations", destinationsArray, {
                shouldValidate: true,
              })
            }
          />

          <Input
            style="bg-white"
            disabled={false}
            error={getTravelError("iteneraryDescription")}
            title="Itinerary Description"
            placeholder="Enter detailed itinerary description"
            type="text"
            {...register("travel.iteneraryDescription")}
          />

          <Input
            style="bg-white"
            disabled={false}
            error={errors.remarks?.message || ""}
            title="Remarks"
            placeholder="Enter any additional remarks"
            type="text"
            {...register("remarks")}
          />

          <InputOption
            disabled={false}
            style="bg-white w-full"
            title="Status"
            options={[
              "pending",
              "confirmed",
              "cancelled",
              "completed",
              "delayed",
            ]}
            {...register("status")}
          />

          <Button
            isLoading={mutation.isPending}
            title="Update Railpass Booking"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default Edit;
