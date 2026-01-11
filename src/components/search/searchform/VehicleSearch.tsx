import type { UseFormRegisterReturn } from "react-hook-form";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import SearchInput from "../SearchInput";

interface FormProps {
  search: UseFormRegisterReturn;
  action: () => void;
}

const VehicleSearch = ({ action, search }: FormProps) => {
  const navigate = useNavigate();

  return (
    <form
      className="relative w-full flex flex-col items-center justify-center gap-4"
      onSubmit={action}
    >
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Vehicles</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput placeholder="search vehicles" {...search} />
        <button
          type="submit"
          className="p-3.5 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer"
        >
          <RiSearchLine size={14} color="white" />
        </button>
      </div>

      <div className="w-full flex flex-row gap-2 items-center justify-center flex-wrap">
        {/* <Options options={countries} {...country} title="Country" />
        <Options options={categories} {...category} title="Category" /> */}

        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/transport/vehicles/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
    </form>
  );
};

export default VehicleSearch;
