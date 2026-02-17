import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  addRentalSchema,
  type addRentalData,
} from "../../types/rental/addRentalTypes";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import DatePicker from "../input/DatePicker";

interface ViewProps {
  transport?: {
    title?: string;
    description?: string;
    _id?: string;
  } | null;
  plan?: {
    plan?: string;
    fee?: number;
    description?: string;
    _id?: string;
  } | null;
  vehicle?: {
    vehicleName?: string;
    brand?: string;
    model?: string;
    year?: number;
    vehicleType?: string;
    _id?: string;
  } | null;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber: string;
  };
  rental: {
    pickUpDate: string;
    pickUpTime: string;
    pickUpLocation: string;
    dropOffDate: string;
    dropOffTime: string;
    dropOffLocation: string;
    specialRequests?: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

const View = ({
  transport,
  plan,
  vehicle,
  customer,
  rental,
  status,
}: ViewProps) => {
  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const methods = useForm<addRentalData>({
    resolver: zodResolver(addRentalSchema),
    defaultValues: {
      transport: transport?._id || "",
      plan: plan?._id || "",
      vehicle: vehicle?._id || "",
      customer: {
        fullName: customer?.fullName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        nationality: customer?.nationality || "",
        passportNumber: customer?.passportNumber || "",
      },
      rental: {
        pickUpDate: formatDateForInput(rental?.pickUpDate || ""),
        pickUpTime: rental?.pickUpTime || "",
        pickUpLocation: rental?.pickUpLocation || "",
        dropOffDate: formatDateForInput(rental?.dropOffDate || ""),
        dropOffTime: rental?.dropOffTime || "",
        dropOffLocation: rental?.dropOffLocation || "",
        specialRequests: rental?.specialRequests || "",
      },
      status: status || "pending",
    },
  });

  const { register, setValue } = methods;

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

  return (
    <FormProvider {...methods}>
      <form className="w-full lg:w-2xl flex flex-col items-center justify-center p-6 gap-6 bg-gray-100">
        <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
          {/* Transport Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">
                Transport Title
              </p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {transport?.title || "N/A"}
              </div>
            </div>
            {transport?.description && (
              <div className="flex flex-col gap-2 md:col-span-2">
                <p className="font-semibold capitalize text-sm">
                  Transport Description
                </p>
                <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                  {transport.description}
                </div>
              </div>
            )}
          </div>

          {/* Plan Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Plan Name</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {plan?.plan || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Fee</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {plan ? `₱${plan.fee?.toLocaleString() || ""}` : "N/A"}
              </div>
            </div>
            {plan?.description && (
              <div className="flex flex-col gap-2 md:col-span-2">
                <p className="font-semibold capitalize text-sm">
                  Plan Description
                </p>
                <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                  {plan.description}
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          {vehicle && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-semibold capitalize text-sm">Vehicle Name</p>
                <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                  {vehicle.vehicleName || "N/A"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold capitalize text-sm">Brand</p>
                <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                  {vehicle.brand || "N/A"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold capitalize text-sm">Model</p>
                <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                  {vehicle.model || "N/A"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold capitalize text-sm">Year</p>
                <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                  {vehicle.year?.toString() || "N/A"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold capitalize text-sm">Vehicle Type</p>
                <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                  {vehicle.vehicleType || "N/A"}
                </div>
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Full Name"
              placeholder=""
              error=""
              {...register("customer.fullName")}
            />
            <Input
              style="bg-white"
              type="email"
              disabled={true}
              title="Email"
              placeholder=""
              error=""
              {...register("customer.email")}
            />
            <Input
              style="bg-white"
              type="tel"
              disabled={true}
              title="Phone"
              placeholder=""
              error=""
              {...register("customer.phone")}
            />
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Nationality"
              placeholder=""
              error=""
              {...register("customer.nationality")}
            />
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Passport Number"
              placeholder=""
              error=""
              {...register("customer.passportNumber")}
            />
          </div>

          {/* Rental Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              style="bg-white"
              disabled={true}
              error=""
              title="Pick-up Date"
              placeholder=""
              name="rental.pickUpDate"
            />
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Pick-up Time"
              placeholder=""
              error=""
              {...register("rental.pickUpTime")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              style="bg-white"
              disabled={true}
              error=""
              title="Drop-off Date"
              placeholder=""
              name="rental.dropOffDate"
            />
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Drop-off Time"
              placeholder=""
              error=""
              {...register("rental.dropOffTime")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Pick-up Location"
              placeholder=""
              error=""
              {...register("rental.pickUpLocation")}
            />
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Drop-off Location"
              placeholder=""
              error=""
              {...register("rental.dropOffLocation")}
            />
          </div>

          {/* Special Requests */}
          {rental?.specialRequests && (
            <div>
              <Input
                style="bg-white"
                type="text"
                disabled={true}
                title="Special Requests"
                placeholder=""
                error=""
                {...register("rental.specialRequests")}
              />
            </div>
          )}

          {/* Status */}
          <div>
            <InputOption
              disabled={true}
              style="bg-white w-full"
              title="Status"
              options={["pending", "confirmed", "cancelled", "completed"]}
              {...register("status")}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default View;
