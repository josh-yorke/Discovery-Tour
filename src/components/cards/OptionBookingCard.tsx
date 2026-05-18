import { RiDeleteBin4Fill, RiEyeFill, RiPencilFill } from "react-icons/ri";
import IconButton from "../button/IconButton";
import { useNavigate } from "react-router";

interface OptionBookingCardProps {
  _id: string;
  fullName: string;
  email: string;
  type: string;
  message: string;
  status: string;
  createdAt: string;
  onDelete: () => void;
}

const OptionBookingCard = ({
  _id,
  fullName,
  email,
  type,
  message,
  status,
  createdAt,
  onDelete,
}: OptionBookingCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      "awaiting payment": "bg-orange-100 text-orange-800",
      paid: "bg-green-100 text-green-800",
      ongoing: "bg-purple-100 text-purple-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
            action={() => navigate(`/options-for-you/view/${_id}`)}
            title=""
            icon={<RiEyeFill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
          <IconButton
            action={() => navigate(`/options-for-you/edit/${_id}`)}
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
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-[#1d2087] text-lg truncate">
            {fullName}
          </p>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {type}
          </span>
        </div>
        <p className="text-xs font-normal text-gray-500 mb-1">{email}</p>
        <p className="text-sm font-normal text-gray-700 mt-2">
          {truncateText(message, 100)}
        </p>
        <p className="text-xs font-normal text-gray-500 mt-2">
          Booked on {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default OptionBookingCard;
