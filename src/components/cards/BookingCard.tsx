import { RiDeleteBin4Fill, RiPencilFill, RiEyeFill } from "react-icons/ri";
import IconButton from "../button/IconButton";
import { useNavigate } from "react-router";

interface Customer {
  fullName: string;
}

interface CardProps {
  _id: string;
  customer: Customer;
  status: string;
  dateAdded: string;
  onDelete: () => void;
}

const BookingCard = ({
  _id,
  customer,
  status,
  dateAdded,
  onDelete,
}: CardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      delayed: "bg-orange-100 text-orange-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-4 gap-4 shadow-xl shadow-black/10">
      <div className="w-full flex items-center justify-between">
        <div
          className={`flex px-3 py-1.5 rounded-lg items-center justify-start ${getStatusColor(
            status,
          )}`}
        >
          <p className="text-xs font-medium capitalize">{status}</p>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            action={() => navigate(`/transport/bookings/view/${_id}`)}
            title=""
            icon={<RiEyeFill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
          <IconButton
            action={() => navigate(`/transport/bookings/edit/${_id}`)}
            title=""
            icon={<RiPencilFill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
          <IconButton
            action={onDelete}
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
        </div>
      </div>

      <div className="w-full">
        <p className="font-bold text-[#1d2087] text-lg truncate">
          {customer.fullName}'s Rail Booking
        </p>
        <p className="text-xs font-normal text-gray-500">
          Booked on {formatDate(dateAdded)}
        </p>
      </div>
    </div>
  );
};

export default BookingCard;
