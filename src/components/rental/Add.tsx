import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  addRentalSchema,
  type addRentalData,
} from "../../types/rental/addRentalTypes";
import { addRental } from "../../hooks/rental/rental";
import Input from "../input/Input";
import Button from "../button/Button";
import SearchableTransportDropdown from "../input/SearchableTransportDropdown";
import SearchablePlanDropdown from "../input/SearchablePlanDropdown";
import InputOption from "../input/InputOption";
import DatePicker from "../input/DatePicker";
import Modal from "../modal/Modal";

const AddRental = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modal, setModal] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  const [emailCustomer, setEmailCustomer] = useState<boolean>(true);
  const [emailAdmin, setEmailAdmin] = useState<boolean>(false);

  const methods = useForm<addRentalData>({
    resolver: zodResolver(addRentalSchema),
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;

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
    mutationFn: (data: addRentalData) =>
      addRental(emailCustomer, emailAdmin, data),
    onSuccess: (data) => {
      setModal({
        message: data?.message || "Rental added successfully!",
        isSuccess: true,
      });
      queryClient.invalidateQueries({ queryKey: ["rentals"], exact: false });
      reset();
    },
    onError: (error: Error) => {
      setModal({
        message: error.message || "Failed to add rental",
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

            <Input
              style="bg-white"
              disabled={false}
              error={errors.customer?.fullName?.message || ""}
              title="Full Name"
              placeholder="Enter full name"
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
                error={errors.rental?.pickUpDate?.message || ""}
                title="Pick-up Date"
                placeholder="Select pick-up date"
                name="rental.pickUpDate"
                minDate={new Date().toISOString().split("T")[0]}
                compareField="rental.dropOffDate"
                comparisonType="before"
                allowSameDay
              />

              <Input
                style="bg-white"
                disabled={false}
                error={errors.rental?.pickUpTime?.message || ""}
                title="Pick-up Time"
                placeholder="Enter pick-up time (e.g., 09:00 AM)"
                type="text"
                {...register("rental.pickUpTime")}
              />
            </div>

            <Input
              style="bg-white"
              disabled={false}
              error={errors.rental?.pickUpLocation?.message || ""}
              title="Pick-up Location"
              placeholder="Enter pick-up location"
              type="text"
              {...register("rental.pickUpLocation")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                style="bg-white"
                disabled={false}
                error={errors.rental?.dropOffDate?.message || ""}
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
                error={errors.rental?.dropOffTime?.message || ""}
                title="Drop-off Time"
                placeholder="Enter drop-off time (e.g., 06:00 PM)"
                type="text"
                {...register("rental.dropOffTime")}
              />
            </div>

            <Input
              style="bg-white"
              disabled={false}
              error={errors.rental?.dropOffLocation?.message || ""}
              title="Drop-off Location"
              placeholder="Enter drop-off location"
              type="text"
              {...register("rental.dropOffLocation")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.rental?.specialRequests?.message || ""}
              title="Special Requests"
              placeholder="Enter any special requests"
              type="text"
              {...register("rental.specialRequests")}
            />

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
                      Confirmation email will be sent to the customer
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
                      Notification email will be sent to admin
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              isLoading={mutation.isPending}
              title="Add Rental"
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

export default AddRental;
