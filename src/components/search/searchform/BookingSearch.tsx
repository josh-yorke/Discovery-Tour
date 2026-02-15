import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import SearchInput from "../SearchInput";
import Options from "../Options";
import RailPassFilter from "../../input/RailPassFilter";

interface FormProps {
  searchValue: string;
  statusValue: string;
  monthValue: string;
  dayValue: string;
  yearValue: string;
  railpassValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onDayChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onRailpassChange: (railpassId: string) => void;
  onSearchSubmit: () => void;
  statuses: string[];
}

const BookingSearch = ({
  searchValue,
  statusValue,
  monthValue,
  dayValue,
  yearValue,
  railpassValue,
  onSearchChange,
  onStatusChange,
  onMonthChange,
  onDayChange,
  onYearChange,
  onRailpassChange,
  onSearchSubmit,
  statuses,
}: FormProps) => {
  const navigate = useNavigate();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMonthChange(e.target.value);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDayChange(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onYearChange(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) =>
    (currentYear - 5 + i).toString(),
  );

  return (
    <div className="w-full relative flex flex-col items-center justify-center gap-4">
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">
          Manage Rail Bookings
        </p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput
          placeholder="search bookings"
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
          options={statuses}
          value={statusValue}
          onChange={handleStatusChange}
          title="Status"
        />

        <Options
          options={months}
          value={monthValue}
          onChange={handleMonthChange}
          title="Month"
        />
        <Options
          options={days}
          value={dayValue}
          onChange={handleDayChange}
          title="Day"
        />
        <Options
          options={years}
          value={yearValue}
          onChange={handleYearChange}
          title="Year"
        />

        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/transport/booking/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
      <RailPassFilter value={railpassValue} onChange={onRailpassChange} />
    </div>
  );
};

export default BookingSearch;
