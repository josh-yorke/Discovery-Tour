import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  addInsuranceBookingSchema,
  type addInsuranceBookingData,
} from "../../../types/insurances/addInsuranceBookingTypes";
import Input from "../../input/Input";
import InputOption from "../../input/InputOption";
import DatePicker from "../../input/DatePicker";

interface ViewProps {
  insurance?: {
    title?: string;
    description?: string;
    provider?: string;
    coverage?: string;
    _id?: string;
  } | null;
  plan?: {
    plan?: string;
    premium?: number;
    coverage?: string;
    description?: string;
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
    destination: {
      country: string;
    };
    dateFrom: string;
    dateTo: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

const View = ({ insurance, plan, customer, travel, status }: ViewProps) => {
  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const methods = useForm<addInsuranceBookingData>({
    resolver: zodResolver(addInsuranceBookingSchema),
    defaultValues: {
      insurance: insurance?._id || "",
      plan: plan?._id || "",
      customer: {
        fullName: customer?.fullName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        nationality: customer?.nationality || "",
        passportNumber: customer?.passportNumber || "",
      },
      travel: {
        destination: travel?.destination.country || "",
        dateFrom: formatDateForInput(travel?.dateFrom || ""),
        dateTo: formatDateForInput(travel?.dateTo || ""),
      },
      status: status || "pending",
    },
  });

  const { register, setValue } = methods;

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
          {/* Insurance Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">
                Insurance Title
              </p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {insurance?.title || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Provider</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {insurance?.provider || "N/A"}
              </div>
            </div>
            {insurance?.description && (
              <div className="flex flex-col gap-2 md:col-span-2">
                <p className="font-semibold capitalize text-sm">
                  Insurance Description
                </p>
                <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                  {insurance.description}
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
              <p className="font-semibold capitalize text-sm">Premium</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {plan ? `₱${plan.premium?.toLocaleString() || ""}` : "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <p className="font-semibold capitalize text-sm">Coverage</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {plan?.coverage || "N/A"}
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
          <div className="grid grid-cols-1 gap-4">
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Destination"
              placeholder=""
              error=""
              {...register("travel.destination")}
            />
          </div>

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
          </div>

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
