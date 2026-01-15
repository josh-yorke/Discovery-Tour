import {
  RiCarFill,
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

interface RentalDetails {
  pickUpDate: string;
  pickUpTime: string;
  pickUpLocation: string;
  dropOffDate: string;
  dropOffTime: string;
  dropOffLocation: string;
  specialRequests: string;
}

interface Transport {
  _id: string;
  title: string;
  description: string;
}

interface Vehicle {
  _id: string;
  vehicleName: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: string;
}

interface Plan {
  _id: string;
  plan: string;
  fee: number;
  description: string;
}

interface CardProps {
  _id: string;
  customer: Customer;
  rental: RentalDetails;
  transport: Transport | null;
  vehicle: Vehicle | null;
  plan: Plan | null;
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
  value: string;
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
          title={value}
          url={linkUrl}
          style={linkStyle || "text-xs font-medium truncate"}
        />
      ) : (
        <span className="text-xs font-medium text-gray-800 truncate">
          {value}
        </span>
      )}
    </div>
  </div>
);

const RentalCard = ({
  _id,
  customer,
  rental,
  transport,
  vehicle,
  plan,
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

  const formatTime = (timeString: string) => {
    return timeString.replace(/(AM|PM)/, " $1");
  };

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-4 gap-4 shadow-xl shadow-black/10">
      <div className="w-full flex items-center justify-between">
        <div
          className={`flex px-3 py-1.5 rounded-lg items-center justify-start ${getStatusColor(
            status
          )}`}
        >
          <p className="text-xs font-medium capitalize">{status}</p>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            action={() => navigate(`/transport/rental/edit/${_id}`)}
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
          {customer.fullName}'s Rental
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
          title="Rental Details"
          icon={RiCalendar2Fill}
          isOpen={openSection === "rental"}
          onToggle={() => toggleSection("rental")}
        >
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <InfoRow
                  label="Pickup Date"
                  value={formatDate(rental.pickUpDate)}
                  icon={RiCalendar2Fill}
                />
                <InfoRow
                  label="Pickup Time"
                  value={formatTime(rental.pickUpTime)}
                  icon={RiCalendar2Fill}
                />
              </div>
              <div className="space-y-2">
                <InfoRow
                  label="Return Date"
                  value={formatDate(rental.dropOffDate)}
                  icon={RiCalendar2Fill}
                />
                <InfoRow
                  label="Return Time"
                  value={formatTime(rental.dropOffTime)}
                  icon={RiCalendar2Fill}
                />
              </div>
            </div>
            <InfoRow
              label="Pickup Location"
              value={rental.pickUpLocation}
              icon={RiMapPin2Fill}
            />
            <InfoRow
              label="Return Location"
              value={rental.dropOffLocation}
              icon={RiMapPin2Fill}
            />
          </div>
        </CollapsibleSection>

        {vehicle && (
          <CollapsibleSection
            title="Vehicle Information"
            icon={RiCarFill}
            isOpen={openSection === "vehicle"}
            onToggle={() => toggleSection("vehicle")}
          >
            <div className="space-y-2">
              <InfoRow
                label="Vehicle Name"
                value={vehicle.vehicleName}
                icon={RiCarFill}
                // REMOVED isLink prop - vehicle is not clickable
              />
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Brand" value={vehicle.brand} icon={RiCarFill} />
                <InfoRow label="Model" value={vehicle.model} icon={RiCarFill} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow
                  label="Year"
                  value={vehicle.year.toString()}
                  icon={RiCalendar2Fill}
                />
                <InfoRow
                  label="Type"
                  value={vehicle.vehicleType}
                  icon={RiCarFill}
                />
              </div>
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
              <InfoRow
                label="Plan"
                value={plan.plan}
                icon={RiFileTextFill}
                // REMOVED isLink prop - plan is not clickable
              />
              <InfoRow
                label="Fee"
                value={`₱${plan.fee.toLocaleString()}`}
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

        {transport && (
          <CollapsibleSection
            title="Transport Information"
            icon={RiCarFill}
            isOpen={openSection === "transport"}
            onToggle={() => toggleSection("transport")}
          >
            <div className="space-y-2">
              <InfoRow
                label="Transport Title"
                value={transport.title}
                icon={RiFileTextFill}
                isLink={true}
                linkUrl={`/transport/transportation/view/${transport._id}`}
                linkStyle="text-xs font-medium truncate"
              />
              {transport.description && (
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-1">
                    Description
                  </span>
                  <p className="text-xs font-normal text-gray-700">
                    {transport.description}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {rental.specialRequests && (
          <CollapsibleSection
            title="Special Requests"
            icon={RiFileTextFill}
            isOpen={openSection === "specialRequests"}
            onToggle={() => toggleSection("specialRequests")}
          >
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-normal text-gray-700 whitespace-pre-line">
                {rental.specialRequests}
              </p>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};

export default RentalCard;
