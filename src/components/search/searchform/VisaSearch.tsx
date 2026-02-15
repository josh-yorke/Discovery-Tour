import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import IconButton from "../../button/IconButton";
import SearchInput from "../SearchInput";
import Options from "../Options";

interface FormProps {
  searchValue: string;
  countryValue: string;
  typeValue: string;
  onSearchChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSearchSubmit: () => void;
  types: string[];
  countries: string[];
}

const VisaSearch = ({
  searchValue,
  countryValue,
  typeValue,
  onSearchChange,
  onCountryChange,
  onTypeChange,
  onSearchSubmit,
  types,
  countries,
}: FormProps) => {
  const navigate = useNavigate();

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryChange(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value);
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
        <p className="text-md font-semibold text-[#1d2087]">Manage Visas</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput
          placeholder="search for visas"
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
          options={countries}
          value={countryValue}
          onChange={handleCountryChange}
          title="Country"
        />

        {types.length > 0 && (
          <Options
            options={types}
            value={typeValue}
            onChange={handleTypeChange}
            title="Visa Type"
          />
        )}

        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/visas/visa/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
    </div>
  );
};

export default VisaSearch;
