import {
  RiTrainFill,
  RiDeleteBin4Fill,
  RiCalendar2Fill,
  RiMapPin2Fill,
  RiUserFill,
  RiMailFill,
  RiPhoneFill,
  RiFileTextFill,
  RiFlagFill,
  RiFilePaperFill,
  RiMoneyDollarCircleFill,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiPencilFill,
  RiGroupFill,
  RiChatSmile2Line,
} from "react-icons/ri";
import { useState } from "react";
import IconButton from "../button/IconButton";
import { useNavigate } from "react-router";
import LinkText from "../nav/LinkText";

interface Customer {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
}

interface TravelDetails {
  dateFrom: string;
  dateTo: string;
  numberOfAdults: number;
  numberOfChildren: number;
  iteneraryDescription: string;
  destinations: string[];
}

interface RailPass {
  _id: string;
  title: string;
  country: string;
  type: string;
  category: string;
  description: string;
}

interface Plan {
  _id: string;
  plan: string;
  fee: number;
  description: string;
  currency: string;
}

interface CardProps {
  _id: string;
  customer: Customer;
  travel: TravelDetails;
  railpass: RailPass | null;
  plan: Plan | null;
  remarks: string;
  status: string;
  dateAdded: string;
  onDelete: () => void;
}

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-[#1d2087]" />
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        {isOpen ? (
          <RiArrowUpSLine size={16} className="text-gray-500" />
        ) : (
          <RiArrowDownSLine size={16} className="text-gray-500" />
        )}
      </button>
      {isOpen && <div className="p-3 bg-white">{children}</div>}
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  icon: Icon,
  isLink = false,
  linkUrl = "",
  linkStyle = "",
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size: number; className?: string }>;
  isLink?: boolean;
  linkUrl?: string;
  linkStyle?: string;
}) => (
  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
    <Icon size={14} className="text-[#1d2087] shrink-0" />
    <div className="flex-1 min-w-0">
      <span className="text-xs text-gray-500 block mb-1">{label}</span>
      {isLink && linkUrl ? (
        <LinkText
          title={String(value)}
          url={linkUrl}
          style={linkStyle || "text-xs font-medium truncate"}
        />
      ) : (
        <span className="text-xs font-medium text-gray-800 truncate">
          {String(value)}
        </span>
      )}
    </div>
  </div>
);

const BookingCard = ({
  _id,
  customer,
  travel,
  railpass,
  plan,
  remarks,
  status,
  dateAdded,
  onDelete,
}: CardProps) => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

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

  const formatCurrency = (amount: number, currency: string = "USD") => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      KRW: "₩",
      PHP: "₱",
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
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
            action={() => navigate(`/transport/booking/edit/${_id}`)}
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

      <div className="w-full flex flex-col gap-3">
        <CollapsibleSection
          title="Customer Information"
          icon={RiUserFill}
          isOpen={openSection === "customer"}
          onToggle={() => toggleSection("customer")}
        >
          <div className="space-y-2">
            <InfoRow
              label="Full Name"
              value={customer.fullName}
              icon={RiUserFill}
            />
            <InfoRow label="Email" value={customer.email} icon={RiMailFill} />
            <InfoRow label="Phone" value={customer.phone} icon={RiPhoneFill} />
            <InfoRow
              label="Nationality"
              value={customer.nationality}
              icon={RiFlagFill}
            />
            <InfoRow
              label="Passport Number"
              value={customer.passportNumber}
              icon={RiFilePaperFill}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Travel Details"
          icon={RiCalendar2Fill}
          isOpen={openSection === "travel"}
          onToggle={() => toggleSection("travel")}
        >
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <InfoRow
                label="Start Date"
                value={formatDate(travel.dateFrom)}
                icon={RiCalendar2Fill}
              />
              <InfoRow
                label="End Date"
                value={formatDate(travel.dateTo)}
                icon={RiCalendar2Fill}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoRow
                label="Adults"
                value={travel.numberOfAdults}
                icon={RiGroupFill}
              />

              <InfoRow
                label="Children"
                value={travel.numberOfChildren}
                icon={RiChatSmile2Line}
              />
            </div>

            <div className="p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500 block mb-1">
                Destinations
              </span>
              <div className="flex flex-wrap gap-1">
                {travel.destinations.map((dest, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200"
                  >
                    {dest}
                  </span>
                ))}
              </div>
            </div>

            {travel.iteneraryDescription && (
              <div className="p-2 bg-gray-50 rounded-lg mt-2">
                <span className="text-xs text-gray-500 block mb-1">
                  Itinerary
                </span>
                <p className="text-xs font-normal text-gray-700 whitespace-pre-line">
                  {travel.iteneraryDescription}
                </p>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {railpass && (
          <CollapsibleSection
            title="Rail Pass Information"
            icon={RiTrainFill}
            isOpen={openSection === "railpass"}
            onToggle={() => toggleSection("railpass")}
          >
            <div className="space-y-2">
              <InfoRow
                label="Rail Pass"
                value={railpass.title}
                icon={RiTrainFill}
                isLink={true}
                linkUrl={`/transport/rail-passes/view/${railpass._id}`}
                linkStyle="text-xs font-medium truncate"
              />
              <div className="grid grid-cols-2 gap-3">
                <InfoRow
                  label="Country"
                  value={railpass.country}
                  icon={RiMapPin2Fill}
                />
                <InfoRow
                  label="Type"
                  value={railpass.type}
                  icon={RiTrainFill}
                />
              </div>
              <InfoRow
                label="Category"
                value={railpass.category}
                icon={RiFileTextFill}
              />
              {railpass.description && (
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-1">
                    Description
                  </span>
                  <p className="text-xs font-normal text-gray-700">
                    {railpass.description}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {plan && (
          <CollapsibleSection
            title="Plan & Payment"
            icon={RiMoneyDollarCircleFill}
            isOpen={openSection === "plan"}
            onToggle={() => toggleSection("plan")}
          >
            <div className="space-y-2">
              <InfoRow label="Plan" value={plan.plan} icon={RiFileTextFill} />
              <InfoRow
                label="Fee"
                value={formatCurrency(plan.fee, plan.currency)}
                icon={RiMoneyDollarCircleFill}
              />
              {plan.description && (
                <div className="p-2 bg-gray-50 rounded-lg mt-2">
                  <span className="text-xs text-gray-500 block mb-1">
                    Description
                  </span>
                  <p className="text-xs font-normal text-gray-700">
                    {plan.description}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {remarks && (
          <CollapsibleSection
            title="Remarks"
            icon={RiFileTextFill}
            isOpen={openSection === "remarks"}
            onToggle={() => toggleSection("remarks")}
          >
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-normal text-gray-700 whitespace-pre-line">
                {remarks}
              </p>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
