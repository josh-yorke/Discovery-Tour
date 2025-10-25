import { RiDeleteBin4Line, RiMailLine, RiPencilLine } from "react-icons/ri";
import IconButton from "../button/IconButton";
import { useNavigate } from "react-router";

interface CardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  onDelete: () => void;
}

const UserCard = ({
  id,
  firstName,
  lastName,
  email,
  role,
  status,
  onDelete,
}: CardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex flex-col items-center justify-center p-6 rounded-lg bg-white"
      key={id}
    >
      <div className="w-full flex flex-col items-start justify-center gap-2">
        <p className="text-sm font-semibold">{`${firstName} ${lastName}`}</p>
        <div className="w-full flex flex-row gap-1 items-center justify-start text-sm">
          <RiMailLine size={16} />
          <p>{email}</p>
        </div>
        <div className="w-full flex flex-row gap-2">
          <p className="text-xs font-normal px-3 py-2 bg-[#1d2087] text-white rounded-sm uppercase">
            {role}
          </p>
          <p className="text-xs font-normal px-3 py-2 bg-[#1d2087] text-white rounded-sm uppercase">
            {status}
          </p>
        </div>
        <div className="w-full flex flex-row items-center justify-end gap-2 pt-6">
          <IconButton
            icon={<RiPencilLine size={16} />}
            title="Edit"
            action={() => navigate(`/users/edit/${id}`)}
            style="bg-gray-200 text-black p-3 rounded-md"
          />
          <IconButton
            icon={<RiDeleteBin4Line size={16} />}
            title="Delete"
            action={onDelete}
            style="bg-gray-200 text-black p-3 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
