import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import Input from "../../input/Input";
import Button from "../../button/Button";
import SearchableInsuranceDropdown from "../../input/SearchableInsuranceDropdown";
import SearchableInsurancePlanDropdown from "../../input/SearchableInsurancePlanDropdown";
import InputOption from "../../input/InputOption";
import DatePicker from "../../input/DatePicker";
import DestinationInput from "../../input/DestinationInput";
import {
  addInsuranceBookingSchema,
  type addInsuranceBookingData,
} from "../../../types/insurances/addInsuranceBookingTypes";
import { addInsuranceBooking } from "../../../hooks/insurances/insuranceBookings";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [emailCustomer, setEmailCustomer] = useState<boolean>(true);
  const [emailAdmin, setEmailAdmin] = useState<boolean>(false);

  const insuranceParam = searchParams.get("insurance");
  const planParam = searchParams.get("plan");

  const methods = useForm<addInsuranceBookingData>({
    resolver: zodResolver(addInsuranceBookingSchema),
    defaultValues: {
      insurance: insuranceParam || "",
      plan: planParam || "",
      customer: {
        fullName: "",
        email: "",
        phone: "",
        nationality: "",
        passportNumber: "",
      },
      travel: {
        dateFrom: "",
        dateTo: "",
        destination: "",
      },
      status: "pending",
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  // Set insurance and plan from URL params
  useEffect(() => {
    if (insuranceParam) {
      setValue("insurance", insuranceParam, { shouldValidate: true });
    }
    if (planParam) {
      setValue("plan", planParam, { shouldValidate: true });
    }
  }, [insuranceParam, planParam, setValue]);

  const mutation = useMutation({
    mutationFn: (data: addInsuranceBookingData) =>
      addInsuranceBooking(emailCustomer, emailAdmin, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["insuranceBookings"],
        exact: false,
      });
      navigate("/insurance/bookings");
      reset();
    },
  });

  const onSubmit = (data: addInsuranceBookingData) => {
    mutation.mutate(data);
  };

  const insuranceValue = watch("insurance") || "";
  const planValue = watch("plan") || "";

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => {
          console.log(err);
        })}
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
            error={errors.insurance?.message || ""}
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
            error={errors.plan?.message || ""}
          />

          <Input
            style="bg-white"
            disabled={false}
            error={errors.customer?.fullName?.message || ""}
            title="Full Name"
            placeholder="Enter passenger full name"
            type="text"
            {...register("customer.fullName")}
          />

          <Input
            style="bg-white"
            disabled={false}
            error={errors.customer?.email?.message || ""}
            title="Email"
            placeholder="Enter email address"
            type="email"
            {...register("customer.email")}
          />

          <Input
            style="bg-white"
            disabled={false}
            error={errors.customer?.phone?.message || ""}
            title="Phone"
            placeholder="Enter phone number"
            type="tel"
            {...register("customer.phone")}
          />

          <Input
            style="bg-white"
            disabled={false}
            error={errors.customer?.nationality?.message || ""}
            title="Nationality"
            placeholder="Enter nationality"
            type="text"
            {...register("customer.nationality")}
          />

          <Input
            style="bg-white"
            disabled={false}
            error={errors.customer?.passportNumber?.message || ""}
            title="Passport Number"
            placeholder="Enter passport number"
            type="text"
            {...register("customer.passportNumber")}
          />

          <DestinationInput
            disabled={false}
            error={errors.travel?.destination?.message || ""}
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
              error={errors.travel?.dateFrom?.message || ""}
              title="Travel Start Date"
              placeholder="Select start date"
              name="travel.dateFrom"
              minDate={new Date().toISOString().split("T")[0]}
              compareField="travel.dateTo"
              comparisonType="before"
            />

            <DatePicker
              style="bg-white"
              disabled={false}
              error={errors.travel?.dateTo?.message || ""}
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

          <div className="bg-white p-4 rounded-3xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Email Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="emailCustomer"
                  checked={emailCustomer}
                  onChange={(e) => setEmailCustomer(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1d2087] focus:ring-[#1d2087] focus:ring-2 focus:ring-offset-0"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="emailCustomer"
                    className="text-xs text-gray-500 block mb-1"
                  >
                    Send email to customer
                  </label>
                  <p className="text-xs font-medium text-gray-800">
                    Confirmation email will be sent to the customer with booking
                    details
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="emailAdmin"
                  checked={emailAdmin}
                  onChange={(e) => setEmailAdmin(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1d2087] focus:ring-[#1d2087] focus:ring-2 focus:ring-offset-0"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="emailAdmin"
                    className="text-xs text-gray-500 block mb-1"
                  >
                    Send email to admin
                  </label>
                  <p className="text-xs font-medium text-gray-800">
                    Notification email will be sent to admin about new booking
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            isLoading={mutation.isPending}
            title="Add Insurance Booking"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default Add;
