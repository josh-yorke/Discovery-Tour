import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  addRailBookingSchema,
  type addRailBookingData,
} from "../../../types/rail-pass/addBookingTypes";
import Input from "../../input/Input";
import InputOption from "../../input/InputOption";
import DatePicker from "../../input/DatePicker";
import DestinationsInput from "../../input/DestinationsInput";
import TextArea from "../../input/TextArea";

interface ViewProps {
  railpass?: {
    title?: string;
    country?: string;
    type?: string;
    category?: string;
    _id?: string;
  } | null;
  plan?: {
    plan?: string;
    fee?: number;
    currency?: string;
    _id?: string;
  } | null;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber: string;
  };
  travel: {
    dateFrom: string;
    dateTo: string;
    numberOfAdults: number;
    numberOfChildren: number;
    destinations: string[];
    iteneraryDescription?: string;
  };
  remarks?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "delayed";
}

const View = ({
  railpass,
  plan,
  customer,
  travel,
  remarks,
  status,
}: ViewProps) => {
  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const methods = useForm<addRailBookingData>({
    resolver: zodResolver(addRailBookingSchema),
    defaultValues: {
      railpass: railpass?._id || "",
      plan: plan?._id || "",
      customer: {
        fullName: customer?.fullName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        nationality: customer?.nationality || "",
        passportNumber: customer?.passportNumber || "",
      },
      travel: {
        dateFrom: formatDateForInput(travel?.dateFrom || ""),
        dateTo: formatDateForInput(travel?.dateTo || ""),
        numberOfAdults: travel?.numberOfAdults || 1,
        numberOfChildren: travel?.numberOfChildren || 0,
        destinations: travel?.destinations || [],
        iteneraryDescription: travel?.iteneraryDescription || "",
      },
      remarks: remarks || "",
      status: status || "pending",
    },
  });

  const { register, setValue, watch } = methods;

  useEffect(() => {
    if (travel) {
      setValue("travel.dateFrom", formatDateForInput(travel.dateFrom || ""));
      setValue("travel.dateTo", formatDateForInput(travel.dateTo || ""));
    }
  }, [travel, setValue]);

  return (
    <FormProvider {...methods}>
      <form className="w-full lg:w-2xl flex flex-col items-center justify-center p-6 gap-6 bg-gray-100">
        <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
          {/* Railpass Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Railpass Title</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {railpass?.title || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Country</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {railpass?.country || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Type</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {railpass?.type || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Category</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {railpass?.category || "N/A"}
              </div>
            </div>
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
                {plan
                  ? `${plan.currency || ""} ${plan.fee?.toLocaleString() || ""}`
                  : "N/A"}
              </div>
            </div>
          </div>

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

          {/* Travel Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              style="bg-white"
              disabled={true}
              error=""
              title="Travel Start Date"
              placeholder=""
              name="travel.dateFrom"
            />
            <DatePicker
              style="bg-white"
              disabled={true}
              error=""
              title="Travel End Date"
              placeholder=""
              name="travel.dateTo"
            />
            <Input
              style="bg-white"
              type="number"
              disabled={true}
              title="Number of Adults"
              placeholder=""
              error=""
              {...register("travel.numberOfAdults")}
            />
            <Input
              style="bg-white"
              type="number"
              disabled={true}
              title="Number of Children"
              placeholder=""
              error=""
              {...register("travel.numberOfChildren")}
            />
          </div>

          {/* Destinations */}
          <div>
            <DestinationsInput
              disabled={true}
              error=""
              title="Destinations"
              placeholder=""
              value={watch("travel.destinations") || []}
              onChange={() => {}}
            />
          </div>

          {/* Itinerary Description */}
          {travel?.iteneraryDescription && (
            <div>
              <TextArea
                disabled={true}
                title="Itinerary Description"
                placeholder=""
                error=""
                {...register("travel.iteneraryDescription")}
              />
            </div>
          )}

          {/* Remarks */}
          {remarks && (
            <div>
              <TextArea
                disabled={true}
                title="Remarks"
                placeholder=""
                error=""
                {...register("remarks")}
              />
            </div>
          )}

          {/* Status */}
          <div>
            <InputOption
              disabled={true}
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
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default View;
