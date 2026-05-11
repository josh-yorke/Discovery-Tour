import { RiAddLine } from "react-icons/ri";
import IconButton from "../../button/IconButton";
import { useNavigate } from "react-router";

const MarkupSearch = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="">
        <p className="text-md font-semibold text-[#1d2087]">Manage Markups</p>
      </div>
      <IconButton
        icon={<RiAddLine size={16} />}
        title="New"
        action={() => navigate("/markups/add")}
        style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
      />
    </div>
  );
};

export default MarkupSearch;
