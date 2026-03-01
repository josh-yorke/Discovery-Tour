import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import Input from "../../input/Input";
import InputOption from "../../input/InputOption";
import Button from "../../button/Button";
import SearchableInsuranceDropdown from "../../input/SearchableInsuranceDropdown";
import DestinationInput from "../../input/DestinationInput";
import DatePicker from "../../input/DatePicker";
import {
  editInsuranceBookingSchema,
  type editInsuranceBookingData,
} from "../../../types/insurances/editInsuranceBookingTypes";
import { updateInsuranceBooking } from "../../../hooks/insurances/insuranceBookings";
import SearchableInsurancePlanDropdown from "../../input/SearchableInsurancePlanDropdown";

interface DestinationObject {
  _id: string;
  country: string;
  savedAt: string;
  __v: number;
}

interface TravelProps {
  dateFrom: string;
  dateTo: string;
  destination: string | DestinationObject;
}

interface EditProps {
  id?: string;
  insurance: string;
  plan: string;
  customer: editInsuranceBookingData["customer"];
  travel?: TravelProps;
  status: editInsuranceBookingData["status"];
}

const Edit = ({
  id: propId,
  insurance,
  plan,
  customer,
  travel,
  status,
}: EditProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const bookingId = propId || routeId || "";

  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const getDestinationId = (
    dest: string | DestinationObject | undefined,
  ): string => {
    if (!dest) return "";
    if (typeof dest === "string") return dest;
    return dest._id;
  };

  const methods = useForm<editInsuranceBookingData>({
    resolver: zodResolver(editInsuranceBookingSchema),
    defaultValues: {
      insurance: insurance || "",
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
        destination: getDestinationId(travel?.destination),
      },
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
      setValue("travel.dateFrom", formatDateForInput(travel.dateFrom));
      setValue("travel.dateTo", formatDateForInput(travel.dateTo));
    }
  }, [travel, setValue]);

  const mutation = useMutation({
    mutationFn: (data: editInsuranceBookingData) =>
      updateInsuranceBooking(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["insuranceBookings"],
        exact: false,
      });
      navigate(-1);
    },
  });

  const onSubmit = (data: editInsuranceBookingData) => {
    mutation.mutate(data);
  };

  const insuranceValue = watch("insurance") || "";
  const planValue = watch("plan") || "";

  const getCustomerError = (
    field: keyof editInsuranceBookingData["customer"],
  ): string => {
    return errors.customer?.[field]?.message?.toString() || "";
  };

  const getTravelError = (
    field: keyof editInsuranceBookingData["travel"],
  ): string => {
    return errors.travel?.[field]?.message?.toString() || "";
  };

  const customerFields = [
    {
      name: "customer.fullName" as const,
      title: "Full Name",
      type: "text",
      placeholder: "Enter full name",
    },
    {
      name: "customer.email" as const,
      title: "Email",
      type: "email",
      placeholder: "Enter email address",
    },
    {
      name: "customer.phone" as const,
      title: "Phone",
      type: "tel",
      placeholder: "Enter phone number",
    },
    {
      name: "customer.nationality" as const,
      title: "Nationality",
      type: "text",
      placeholder: "Enter nationality",
    },
    {
      name: "customer.passportNumber" as const,
      title: "Passport Number",
      type: "text",
      placeholder: "Enter passport number",
    },
  ];

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
        className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      >
        <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
          <SearchableInsuranceDropdown
            disabled={false}
            title="Insurance Policy"
            value={insuranceValue}
            onChange={(insuranceId: string) => {
              setValue("insurance", insuranceId, { shouldValidate: true });
              if (planValue) {
                setValue("plan", "", { shouldValidate: true });
              }
            }}
            placeholder="Search for an insurance policy..."
            error={errors.insurance?.message}
          />

          <SearchableInsurancePlanDropdown
            disabled={!insuranceValue}
            title="Plan"
            value={planValue}
            insuranceId={insuranceValue}
            onChange={(planId: string) => {
              setValue("plan", planId, { shouldValidate: true });
            }}
            placeholder={
              !insuranceValue
                ? "Select an insurance policy first"
                : "Search for a plan..."
            }
            error={errors.plan?.message}
          />

          {customerFields.map((field) => (
            <Input
              key={field.name}
              style="bg-white"
              disabled={false}
              error={getCustomerError(field.name.split(".")[1] as any)}
              title={field.title}
              placeholder={field.placeholder}
              type={field.type}
              {...register(field.name)}
            />
          ))}

          <DestinationInput
            disabled={false}
            error={getTravelError("destination")}
            title="Destination"
            value={watch("travel.destination") || ""}
            onChange={(countryId: string) =>
              setValue("travel.destination", countryId, {
                shouldValidate: true,
              })
            }
            placeholder="Select a destination country..."
          />

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

          <InputOption
            disabled={false}
            style="bg-white w-full"
            title="Status"
            options={["pending", "confirmed", "cancelled", "completed"]}
            {...register("status")}
          />

          <Button
            isLoading={mutation.isPending}
            title="Update Insurance Booking"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default Edit;
