import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import SearchInput from "../SearchInput";
import Options from "../Options";

interface FormProps {
  searchValue: string;
  statusValue: string;
  availabilityValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
  onSearchSubmit: () => void;
  statuses: string[];
  availability: string[];
}

const VehicleSearch = ({
  searchValue,
  statusValue,
  availabilityValue,
  onSearchChange,
  onStatusChange,
  onAvailabilityChange,
  onSearchSubmit,
  statuses,
  availability,
}: FormProps) => {
  const navigate = useNavigate();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value);
  };

  const handleAvailabilityChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onAvailabilityChange(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center gap-4">
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Vehicles</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput
          placeholder="search vehicles"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <button
          onClick={onSearchSubmit}
          className="p-3.5 rounded-full bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer"
        >
          <RiSearchLine size={14} color="white" />
        </button>
      </div>

      <div className="w-full flex flex-row gap-2 items-center justify-center flex-wrap">
        <Options
          options={availability}
          value={availabilityValue}
          onChange={handleAvailabilityChange}
          title="isAvailable?"
        />
        <Options
          options={statuses}
          value={statusValue}
          onChange={handleStatusChange}
          title="Status"
        />

        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/transport/vehicles/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
    </div>
  );
};

export default VehicleSearch;
