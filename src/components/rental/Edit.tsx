import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
  addRentalSchema,
  type addRentalData,
} from "../../types/rental/addRentalTypes";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import Button from "../button/Button";
import SearchableTransportDropdown from "../input/SearchableTransportDropdown";
import SearchablePlanDropdown from "../input/SearchablePlanDropdown";
import { updateRental } from "../../hooks/rental/rental";
import DatePicker from "../input/DatePicker";

interface EditProps extends addRentalData {
  id?: string;
}

const Edit = ({
  id: propId,
  transport,
  plan,
  vehicle,
  customer,
  rental,
  status,
}: EditProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const rentalId = propId || routeId || "";

  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const methods = useForm<addRentalData>({
    resolver: zodResolver(addRentalSchema),
    defaultValues: {
      transport: transport || "",
      plan: plan || "",
      vehicle: vehicle || "",
      customer: {
        fullName: customer?.fullName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        nationality: customer?.nationality || "",
        passportNumber: customer?.passportNumber || "",
      },
      rental: {
        pickUpDate: "",
        pickUpTime: rental?.pickUpTime || "",
        pickUpLocation: rental?.pickUpLocation || "",
        dropOffDate: "",
        dropOffTime: rental?.dropOffTime || "",
        dropOffLocation: rental?.dropOffLocation || "",
        specialRequests: rental?.specialRequests || "",
      },
      status: status || "pending",
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (rental) {
      setValue(
        "rental.pickUpDate",
        formatDateForInput(rental.pickUpDate || ""),
      );
      setValue(
        "rental.dropOffDate",
        formatDateForInput(rental.dropOffDate || ""),
      );
    }
  }, [rental, setValue]);

  const convertToMinutes = (time: string): number => {
    if (!time) return -1;
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }
    return 0;
  };

  const pickUpDate = watch("rental.pickUpDate");
  const dropOffDate = watch("rental.dropOffDate");
  const pickUpTime = watch("rental.pickUpTime");
  const dropOffTime = watch("rental.dropOffTime");

  useEffect(() => {
    if (pickUpDate && dropOffDate && pickUpTime && dropOffTime) {
      const isSameDay = pickUpDate === dropOffDate;

      if (isSameDay) {
        const pickUpMinutes = convertToMinutes(pickUpTime);
        const dropOffMinutes = convertToMinutes(dropOffTime);

        if (pickUpMinutes >= dropOffMinutes) {
          setError("rental.dropOffTime", {
            type: "manual",
            message:
              "Drop-off time must be later than pick-up time for same-day rentals",
          });
        } else {
          clearErrors("rental.dropOffTime");
        }
      } else {
        clearErrors("rental.dropOffTime");
      }
    }
  }, [pickUpDate, dropOffDate, pickUpTime, dropOffTime, setError, clearErrors]);

  const mutation = useMutation({
    mutationFn: (data: addRentalData) => updateRental(rentalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"], exact: false });
      navigate(-1);
    },
  });

  const onSubmit = (data: addRentalData) => {
    const isSameDay = data.rental.pickUpDate === data.rental.dropOffDate;

    if (isSameDay) {
      const pickUpMinutes = convertToMinutes(data.rental.pickUpTime);
      const dropOffMinutes = convertToMinutes(data.rental.dropOffTime);

      if (pickUpMinutes >= dropOffMinutes) {
        setError("rental.dropOffTime", {
          type: "manual",
          message:
            "Drop-off time must be later than pick-up time for same-day rentals",
        });
        return;
      }
    }

    mutation.mutate(data);
  };

  const transportValue = watch("transport") || "";
  const planValue = watch("plan") || "";

  const getCustomerError = (
    field: keyof NonNullable<addRentalData["customer"]>,
  ): string => {
    return errors.customer?.[field]?.message?.toString() || "";
  };

  const getRentalError = (
    field: keyof NonNullable<addRentalData["rental"]>,
  ): string => {
    return errors.rental?.[field]?.message?.toString() || "";
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

  const rentalFields = [
    {
      name: "rental.pickUpLocation" as const,
      title: "Pick-up Location",
      type: "text",
      placeholder: "Enter pick-up location",
      error: getRentalError("pickUpLocation"),
    },
    {
      name: "rental.dropOffLocation" as const,
      title: "Drop-off Location",
      type: "text",
      placeholder: "Enter drop-off location",
      error: getRentalError("dropOffLocation"),
    },
    {
      name: "rental.specialRequests" as const,
      title: "Special Requests",
      type: "text",
      placeholder: "Enter any special requests",
      error: getRentalError("specialRequests"),
    },
  ];

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
        className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      >
        <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
          <SearchableTransportDropdown
            disabled={false}
            title="Transport"
            value={transportValue}
            onChange={(transportId: string) =>
              setValue("transport", transportId, { shouldValidate: true })
            }
            placeholder="Search for a transport..."
          />

          <SearchablePlanDropdown
            disabled={false}
            title="Plan"
            value={planValue}
            transportId={transportValue}
            onChange={(planId: string, vehicleId: string) => {
              setValue("plan", planId, { shouldValidate: true });
              setValue("vehicle", vehicleId, { shouldValidate: true });
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
              error={getRentalError("pickUpDate")}
              title="Pick-up Date"
              placeholder="Select pick-up date"
              name="rental.pickUpDate"
              compareField="rental.dropOffDate"
              comparisonType="before"
              allowSameDay
            />

            <Input
              style="bg-white"
              disabled={false}
              error={getRentalError("pickUpTime")}
              title="Pick-up Time"
              placeholder="Enter pick-up time (e.g., 09:00 AM)"
              type="text"
              {...register("rental.pickUpTime")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              style="bg-white"
              disabled={false}
              error={getRentalError("dropOffDate")}
              title="Drop-off Date"
              placeholder="Select drop-off date"
              name="rental.dropOffDate"
              compareField="rental.pickUpDate"
              comparisonType="after"
              allowSameDay
            />

            <Input
              style="bg-white"
              disabled={false}
              error={getRentalError("dropOffTime")}
              title="Drop-off Time"
              placeholder="Enter drop-off time (e.g., 06:00 PM)"
              type="text"
              {...register("rental.dropOffTime")}
            />
          </div>

          {errors.rental?.dropOffTime && (
            <p className="text-red-600 text-sm -mt-2">
              {errors.rental.dropOffTime.message}
            </p>
          )}

          {rentalFields.map((field) => (
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

          <InputOption
            disabled={false}
            style="bg-white w-full"
            title="Status"
            options={["pending", "confirmed", "cancelled", "completed"]}
            {...register("status")}
          />

          <Button
            isLoading={mutation.isPending}
            title="Update Rental"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default Edit;
