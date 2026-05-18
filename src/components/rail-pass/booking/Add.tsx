import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  addRailBookingSchema,
  type addRailBookingData,
} from "../../../types/rail-pass/addBookingTypes";
import Input from "../../input/Input";
import Button from "../../button/Button";
import SearchableRailPassDropdown from "../../input/SearchableRailPassDropdown";
import SearchableRailPlanDropdown from "../../input/SearchableRailPlanDropdown";
import InputOption from "../../input/InputOption";
import DatePicker from "../../input/DatePicker";
import { addPassBooking } from "../../../hooks/rail-passes/passBooking";
import DestinationsInput from "../../input/DestinationsInput";
import Modal from "../../modal/Modal";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modal, setModal] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  const [emailCustomer, setEmailCustomer] = useState<boolean>(true);
  const [emailAdmin, setEmailAdmin] = useState<boolean>(false);

  const methods = useForm<addRailBookingData>({
    resolver: zodResolver(addRailBookingSchema),
    defaultValues: {
      travel: {
        numberOfAdults: 1,
        numberOfChildren: 0,
        destinations: [],
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

  const mutation = useMutation({
    mutationFn: (data: addRailBookingData) =>
      addPassBooking(emailCustomer, emailAdmin, data),
    onSuccess: (data) => {
      setModal({
        message: data?.message || "Railpass booking added successfully!",
        isSuccess: true,
      });
      queryClient.invalidateQueries({ queryKey: ["railpasses"], exact: false });
      reset();
    },
    onError: (error: Error) => {
      setModal({
        message: error.message || "Failed to add railpass booking",
        isSuccess: false,
      });
    },
  });

  const handleModalClose = () => {
    setModal(null);
    if (modal?.isSuccess) {
      navigate(-1);
    }
  };

  const onSubmit = (data: addRailBookingData) => {
    mutation.mutate(data);
  };

  const railpassValue = watch("railpass") || "";
  const planValue = watch("plan") || "";

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
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
              error={errors.railpass?.message || ""}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                style="bg-white"
                disabled={false}
                error={errors.travel?.numberOfAdults?.message || ""}
                title="Number of Adults"
                placeholder="Enter number of adults"
                type="number"
                {...register("travel.numberOfAdults", { valueAsNumber: true })}
              />

              <Input
                style="bg-white"
                disabled={false}
                error={errors.travel?.numberOfChildren?.message || ""}
                title="Number of Children"
                placeholder="Enter number of children"
                type="number"
                {...register("travel.numberOfChildren", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <DestinationsInput
              disabled={false}
              error={errors.travel?.destinations?.message || ""}
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
              error={errors.travel?.iteneraryDescription?.message || ""}
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
                      Confirmation email will be sent to the customer with
                      booking details
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
              title="Add Railpass Booking"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>

      {modal && (
        <Modal
          message={modal.message}
          success={modal.isSuccess}
          action={handleModalClose}
        />
      )}
    </>
  );
};

export default Add;
