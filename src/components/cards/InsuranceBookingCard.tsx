import { RiDeleteBin4Fill, RiPencilFill, RiEyeFill } from "react-icons/ri";
import IconButton from "../button/IconButton";
import { useNavigate } from "react-router";

interface Customer {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
}

interface Destination {
  country: string;
}

interface Travel {
  destination: Destination;
  dateFrom: string;
  dateTo: string;
}

interface Insurance {
  title: string;
  insurancePartner: string;
}

interface Plan {
  plan: string;
  fee: number;
  currency: string;
}

interface CardProps {
  _id: string;
  customer: Customer;
  travel: Travel;
  insurance: Insurance;
  plan: Plan;
  status: string;
  dateAdded: string;
  onDelete: () => void;
}

const InsuranceBookingCard = ({
  _id,
  customer,
  travel,
  insurance,
  plan,
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

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      KRW: "₩",
      PHP: "₱",
    };
    return `${symbols[currency] || currency}${amount.toLocaleString()}`;
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
            action={() => navigate(`/insurance/bookings/view/${_id}`)}
            title=""
            icon={<RiEyeFill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
          <IconButton
            action={() => navigate(`/insurance/bookings/edit/${_id}`)}
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
          {customer.fullName}'s Insurance Booking
        </p>
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-xs font-normal text-gray-600">
            <span className="font-medium">Destination:</span>{" "}
            {travel.destination.country}
          </p>
          <p className="text-xs font-normal text-gray-600">
            <span className="font-medium">Travel Dates:</span>{" "}
            {formatDate(travel.dateFrom)} - {formatDate(travel.dateTo)}
          </p>
          <p className="text-xs font-normal text-gray-600">
            <span className="font-medium">Policy:</span> {insurance.title} (
            {insurance.insurancePartner})
          </p>
          <p className="text-xs font-normal text-gray-600">
            <span className="font-medium">Plan:</span> {plan.plan} -{" "}
            {formatCurrency(plan.fee, plan.currency)}
          </p>
        </div>
        <p className="text-xs font-normal text-gray-500 mt-2">
          Booked on {formatDate(dateAdded)}
        </p>
      </div>
    </div>
  );
};

export default InsuranceBookingCard;
