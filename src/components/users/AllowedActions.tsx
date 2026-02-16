import { useEffect, useRef } from "react";

const ROLE_DEFAULT_ACTIONS = {
  admin: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
  staff: {
    create: true,
    read: true,
    update: true,
    delete: false,
  },
  user: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
};

type Role = keyof typeof ROLE_DEFAULT_ACTIONS;

interface AllowedActionsProps {
  register: any;
  watch: any;
  reset: any;
}

const AllowedActionsInputs = ({
  register,
  watch,
  reset,
}: AllowedActionsProps) => {
  const role = watch("role") as Role | undefined;
  const isAdmin = role === "admin";
  const watchedActions = watch("allowedActions");

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
      allowedActions: ROLE_DEFAULT_ACTIONS[role],
    }));
  }, [role, reset]);

  const actionsToDisplay = {
    ...watchedActions,
    read: true, // * force read
  };

  return (
    <div className="bg-white p-4 rounded-3xl">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Allowed Actions
      </h3>
      {Object.keys(actionsToDisplay).map((key) => (
        <div
          key={key}
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
        >
          <input
            type="checkbox"
            {...register(`allowedActions.${key}`)}
            className={`h-4 w-4 rounded border-gray-300 text-[#1d2087]
              ${isAdmin || key === "read" ? "pointer-events-none opacity-60" : ""}`}
          />
          <div className="flex-1 min-w-0">
            <label
              htmlFor={key}
              className="text-xs text-gray-500 block mb-1 capitalize"
            >
              {key}
            </label>
            <p className="text-xs font-medium text-gray-800">
              {getActionDescription(key)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const getActionDescription = (action: string) => {
  switch (action) {
    case "create":
      return "Allow creation of data or addition of information.";
    case "read":
      return "Allow viewing or reading of data or information.";
    case "update":
      return "Allow update or modification of data or information.";
    case "delete":
      return "Allow deletion or removal of data or information.";
    default:
      return "";
  }
};

export default AllowedActionsInputs;
