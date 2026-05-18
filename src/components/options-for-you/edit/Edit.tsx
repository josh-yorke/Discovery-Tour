import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import {
  editOptionBookingSchema,
  type EditOptionBookingData,
} from "../../../types/options/editOptionBooking";
import InputOption from "../../input/InputOption";
import TextArea from "../../input/TextArea";
import Input from "../../input/Input";
import Modal from "../../modal/Modal";
import Button from "../../button/Button";
import { updateOptionBooking } from "../../../hooks/options/options";

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

interface EditOptionBookingDetailsProps {
  booking: {
    _id: string;
    fullName: string;
    email: string;
    type:
      | "Customized Tours"
      | "Airline Reservation"
      | "Restaurant Bookings"
      | "Hotel Bookings";
    message: string;
    status:
      | "pending"
      | "confirmed"
      | "awaiting payment"
      | "paid"
      | "ongoing"
      | "completed"
      | "cancelled";
  };
}

const Edit = ({ booking }: EditOptionBookingDetailsProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const bookingId = booking?._id || routeId || "";
  const [modal, setModal] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  const methods = useForm<EditOptionBookingData>({
    resolver: zodResolver(editOptionBookingSchema),
    defaultValues: {
      fullName: booking?.fullName || "",
      email: booking?.email || "",
      type: booking?.type || "Customized Tours",
      message: booking?.message || "",
      status: booking?.status || "pending",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: (data: EditOptionBookingData) =>
      updateOptionBooking(bookingId, data),
    onSuccess: (data) => {
      setModal({
        message: data || "Booking updated successfully!",
        isSuccess: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["option-bookings"],
        exact: false,
      });
    },
    onError: (error: Error) => {
      setModal({
        message: error.message || "Failed to update booking",
        isSuccess: false,
      });
    },
  });

  const handleModalClose = () => {
    setModal(null);
    if (modal?.isSuccess) {
      navigate("/options-for-you");
    }
  };

  const onSubmit = (data: EditOptionBookingData) => {
    mutation.mutate(data);
  };

  const getFieldError = (field: keyof EditOptionBookingData): string => {
    return errors[field]?.message || "";
  };

  const fields = [
    {
      name: "fullName" as const,
      title: "Full Name",
      type: "text",
      placeholder: "Enter full name",
    },
    {
      name: "email" as const,
      title: "Email",
      type: "email",
      placeholder: "Enter email address",
    },
  ];

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
          className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            {fields.map((field) => (
              <Input
                key={field.name}
                style="bg-white"
                disabled={false}
                error={getFieldError(field.name)}
                title={field.title}
                placeholder={field.placeholder}
                type={field.type}
                {...register(field.name)}
              />
            ))}

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
              error={getFieldError("message")}
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

            <Button
              isLoading={mutation.isPending}
              title="Update Booking"
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

export default Edit;
