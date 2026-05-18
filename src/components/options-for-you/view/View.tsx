import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../../input/Input";
import InputOption from "../../input/InputOption";

interface OptionBooking {
  _id: string;
  fullName: string;
  email: string;
  type: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ViewOptionBookingDetailsProps {
  booking: OptionBooking;
}

const viewOptionBookingSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  type: z.string(),
  message: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type ViewOptionBookingData = z.infer<typeof viewOptionBookingSchema>;

const View = ({ booking }: ViewOptionBookingDetailsProps) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const methods = useForm<ViewOptionBookingData>({
    resolver: zodResolver(viewOptionBookingSchema),
    defaultValues: {
      fullName: booking?.fullName || "",
      email: booking?.email || "",
      type: booking?.type || "",
      message: booking?.message || "",
      status: booking?.status || "pending",
      createdAt: formatDate(booking?.createdAt),
      updatedAt: formatDate(booking?.updatedAt),
    },
  });

  const { register } = methods;

  const statusOptions = [
    "pending",
    "confirmed",
    "awaiting payment",
    "paid",
    "ongoing",
    "completed",
    "cancelled",
  ];

  return (
    <FormProvider {...methods}>
      <form className="w-full lg:w-2xl flex flex-col items-center justify-center p-6 gap-6 bg-gray-100">
        <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
          {/* Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Booking ID</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {booking?._id || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Booking Type</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {booking?.type || "N/A"}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2 md:col-span-2">
              <p className="font-semibold capitalize text-sm">
                Customer Information
              </p>
              <div className="border-b border-gray-200 my-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              type="text"
              disabled={true}
              title="Full Name"
              placeholder=""
              error=""
              {...register("fullName")}
            />
            <Input
              style="bg-white"
              type="email"
              disabled={true}
              title="Email"
              placeholder=""
              error=""
              {...register("email")}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold capitalize text-sm">Message</p>
            <div className="w-full px-6 py-4 bg-white rounded-2xl font-normal whitespace-pre-wrap">
              {booking?.message || "No message provided"}
            </div>
          </div>

          {/* Timeline Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2 md:col-span-2">
              <p className="font-semibold capitalize text-sm">Timeline</p>
              <div className="border-b border-gray-200 my-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Created At</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {formatDate(booking?.createdAt) || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold capitalize text-sm">Last Updated</p>
              <div className="w-full px-6 py-3 bg-white rounded-full font-normal">
                {formatDate(booking?.updatedAt) || "N/A"}
              </div>
            </div>
          </div>

          <div>
            <InputOption
              disabled={true}
              style="bg-white w-full"
              title="Status"
              options={statusOptions}
              {...register("status")}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default View;
