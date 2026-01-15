// components/search/searchform/RentalSearch.tsx
import type { UseFormRegisterReturn } from "react-hook-form";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import SearchInput from "../SearchInput";
import Options from "../Options";
import VehicleFilter from "../../input/VehicleFilter";

interface FormProps {
  search: UseFormRegisterReturn;
  vehicle: UseFormRegisterReturn;
  day: UseFormRegisterReturn;
  month: UseFormRegisterReturn;
  year: UseFormRegisterReturn;
  status: UseFormRegisterReturn;
  action: () => void;
  statuses: string[];
  onVehicleChange: (vehicleId: string) => void;
  vehicleValue: string;
}

const RentalSearch = ({
  action,
  search,
  month,
  day,
  year,
  statuses,
  status,
  onVehicleChange,
  vehicleValue,
}: FormProps) => {
  const navigate = useNavigate();

  return (
    <form
      className="w-full relative flex flex-col items-center justify-center gap-4"
      onSubmit={action}
    >
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Rentals</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput placeholder="search rentals" {...search} />
        <button
          type="submit"
          className="p-3.5 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer"
        >
          <RiSearchLine size={14} color="white" />
        </button>
      </div>

      <div className="w-full flex flex-row gap-2 items-center justify-center flex-wrap">
        <Options options={statuses} {...status} title="Status" />

        <Options options={[]} {...month} title="Month" />
        <Options options={[]} {...day} title="Day" />
        <Options options={[]} {...year} title="Year" />

        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/transport/rental/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
      <VehicleFilter value={vehicleValue} onChange={onVehicleChange} />
    </form>
  );
};

export default RentalSearch;
