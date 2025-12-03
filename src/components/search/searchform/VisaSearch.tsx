import type { UseFormRegisterReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import SearchInput from "../SearchInput";
import Options from "../Options";

interface FormProps {
  search: UseFormRegisterReturn;
  country: UseFormRegisterReturn;
  visaType: UseFormRegisterReturn;
  action: () => void;
  result: any[]; // This should contain the visa data
}

const VisaSearch = ({
  action,
  search,
  country,
  visaType,
  result,
}: FormProps) => {
  const navigate = useNavigate();
  const [visaTypes, setVisaTypes] = useState<string[]>([]);

  // Extract unique visa types from the result data
  useEffect(() => {
    if (result && Array.isArray(result)) {
      // Extract all unique types from the visa data
      const types = [
        ...new Set(result.map((visa) => visa.type).filter(Boolean)),
      ];
      setVisaTypes(types);
    } else {
      setVisaTypes([]);
    }
  }, [result]);

  return (
    <form
      className="relative w-full flex flex-col items-center justify-center gap-4"
      onSubmit={action}
    >
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Visas</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput placeholder="search for visas" {...search} />
        <button
          type="submit"
          className="p-3.5 rounded-lg bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer"
        >
          <RiSearchLine size={14} color="white" />
        </button>
      </div>

      <div className="w-full flex flex-row gap-2 items-center justify-center flex-wrap">
        <Options
          options={["Japan", "Korea", "Resident"]}
          {...country}
          title="Country"
        />

        {/* Visa Type Dropdown - Only show if there are visa types available */}
        {visaTypes.length > 0 && (
          <Options options={visaTypes} {...visaType} title="Visa Type" />
        )}

        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/visas/visa/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-lg"
        />
      </div>
    </form>
  );
};

export default VisaSearch;
