import { useEffect, useRef } from "react";

const ROLE_DEFAULT_EMAILS = {
  admin: {
    contactPage: true,
    railPass: true,
    transportation: true,
    insurance: true,
    optionsForYou: true,
  },
  staff: {
    contactPage: true,
    railPass: true,
    transportation: false,
    insurance: false,
    optionsForYou: false,
  },
  user: {
    contactPage: true,
    railPass: false,
    transportation: false,
    insurance: false,
    optionsForYou: false,
  },
};

type Role = keyof typeof ROLE_DEFAULT_EMAILS;

interface EmailReceiverSetterProps {
  register: any;
  watch: any;
  reset: any;
}

const EmailReceiverSetterInputs = ({
  register,
  watch,
  reset,
}: EmailReceiverSetterProps) => {
  const role = watch("role") as Role | undefined;
  const watchedEmailReceivers = watch("receiveEmailFrom");

  // * Ref to store the original role from DB
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (!role) return;

    // * First render: mark hydrated, do NOTHING
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      return;
    }

    // * Any role change AFTER hydration → apply defaults
    reset((prev: any) => ({
      ...prev,
      receiveEmailFrom: ROLE_DEFAULT_EMAILS[role],
    }));
  }, [role, reset]);

  const actionsToDisplay = {
    ...watchedEmailReceivers,
    railPass: true, // * force read
  };

  return (
    <div className="bg-white p-4 rounded-3xl">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Receive Emails From
      </h3>
      {Object.keys(actionsToDisplay).map((key) => (
        <div
          key={key}
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
        >
          <input
            type="checkbox"
            {...register(`receiveEmailFrom.${key}`)}
            className={`h-4 w-4 rounded border-gray-300 text-[#1d2087]
              ${key === "read" ? "pointer-events-none opacity-60" : ""}`}
          />
          <div className="flex-1 min-w-0">
            <label
              htmlFor={key}
              className="text-xs text-gray-500 block mb-1 capitalize"
            >
              {key}
            </label>
            <p className="text-xs font-medium text-gray-800">
              {getEmailReceiverDescription(key)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const getEmailReceiverDescription = (action: string) => {
  switch (action) {
    case "contactPage":
      return "Receive emails from contact page submission from clients/customers";
    case "railPass":
      return "Receive emails about Rail Pass Booking submission of clients/customers";
    case "transportation" :
      return "Receive emails about Vehicle Rental from clients/customers";
    case "insurance" :
      return "Receive emails about Insurance Booking submission from clients/customers";
    case "optionsForYou":
      return "Receive emails about the submission of form in Options For You page of clients/customers";
    default:
      return "";
  }
};

export default EmailReceiverSetterInputs;
