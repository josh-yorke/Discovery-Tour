import { RiAddLine, RiSearchLine } from "react-icons/ri";
import SearchInput from "../SearchInput";
import Options from "../Options";
import IconButton from "../../button/IconButton";
import { useNavigate } from "react-router";

interface FormProps {
  searchValue: string;
  statusValue: string;
  roleValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const UsersSearch = ({
  searchValue,
  statusValue,
  roleValue,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onSearchSubmit,
}: FormProps) => {
  const navigate = useNavigate();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRoleChange(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Users</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput
          placeholder="search for users"
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
      <div className="w-full flex flex-row gap-2 items-center justify-center">
        <Options
          options={["admin", "user"]}
          value={roleValue}
          onChange={handleRoleChange}
          title="Role"
        />
        <Options
          options={["active", "pending"]}
          value={statusValue}
          onChange={handleStatusChange}
          title="Status"
        />
        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/users/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>
    </div>
  );
};

export default UsersSearch;
