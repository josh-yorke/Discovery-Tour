import { RiAddLine, RiSearchLine } from "react-icons/ri";
import SearchInput from "../SearchInput";
import Options from "../Options";
import type { UseFormRegisterReturn } from "react-hook-form";
import IconButton from "../../button/IconButton";
import { useNavigate } from "react-router";

interface FormProps {
  search: UseFormRegisterReturn;
  status: UseFormRegisterReturn;
  role: UseFormRegisterReturn;
  action: () => void;
}

const UsersSearch = ({ action, role, status, search }: FormProps) => {
  const navigate = useNavigate();

  return (
    <form
      className="w-full flex flex-col items-center justify-center gap-4"
      onSubmit={action}
    >
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Users</p>
      </div>
      <div className="w-full lg:w-2/4 flex items-center justify-center gap-2">
        <SearchInput placeholder="search for users" {...search} />
        <button className="p-3.5 rounded-lg bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer">
          <RiSearchLine size={14} color="white" />
        </button>
      </div>
      <div className="w-full flex flex-row gap-2 items-center justify-center">
        <Options options={["admin", "user"]} {...role} />
        <Options options={["active", "pending"]} {...status} />
        <IconButton
          icon={<RiAddLine size={16} />}
          title="New"
          action={() => navigate("/users/add")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-lg"
        />
      </div>
    </form>
  );
};

export default UsersSearch;
