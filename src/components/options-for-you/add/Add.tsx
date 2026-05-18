import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  addOptionBookingSchema,
  type AddOptionBookingData,
} from "../../../types/options/addOptionBooking";
import { addOptionBooking } from "../../../hooks/options/options";
import Input from "../../input/Input";
import InputOption from "../../input/InputOption";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import TextArea from "../../input/TextArea";

const bookingTypes = [
  "Customized Tours",
  "Airline Reservation",
  "Restaurant Bookings",
  "Hotel Bookings",
];

const statusOptions = [
  "pending",
  "confirmed",
  "awaiting payment",
  "paid",
  "ongoing",
  "completed",
  "cancelled",
];

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modal, setModal] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  const [emailCustomer, setEmailCustomer] = useState<boolean>(true);
  const [emailAdmin, setEmailAdmin] = useState<boolean>(false);

  const methods = useForm<AddOptionBookingData>({
    resolver: zodResolver(addOptionBookingSchema),
    defaultValues: {
      status: "pending",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: (data: AddOptionBookingData) =>
      addOptionBooking(emailCustomer, emailAdmin, data),
    onSuccess: (data) => {
      setModal({
        message: data?.message || "Booking added successfully!",
        isSuccess: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["option-bookings"],
        exact: false,
      });
      reset();
    },
    onError: (error: Error) => {
      setModal({
        message: error.message || "Failed to add booking",
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

  const onSubmit = (data: AddOptionBookingData) => {
    mutation.mutate(data);
  };

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
            {/* Customer Information */}
            <Input
              style="bg-white"
              disabled={false}
              error={errors.fullName?.message || ""}
              title="Full Name"
              placeholder="Enter full name"
              type="text"
              {...register("fullName")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.email?.message || ""}
              title="Email"
              placeholder="Enter email address"
              type="email"
              {...register("email")}
            />

            {/* Booking Type */}
            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Booking Type"
                options={bookingTypes}
                {...register("type")}
              />
              {errors.type && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Message */}
            <TextArea
              disabled={false}
              error={errors.message?.message || ""}
              title="Message"
              placeholder="Enter any additional details or special requests..."
              {...register("message")}
            />

            {/* Status */}
            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Status"
                options={statusOptions}
                {...register("status")}
              />
              {errors.status && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Email Notifications */}
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
              title="Add Booking"
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
