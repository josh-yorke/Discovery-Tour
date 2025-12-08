import { useNavigate } from "react-router";
import { RiDeleteBin4Fill, RiFilePdfFill, RiPencilFill } from "react-icons/ri";
import IconButton from "../../button/IconButton";

interface CardProps {
  plan: string;
  fee: string;
  description: string;
  visa: string;
  filesAssociated: string;
  onDelete: () => void;
  id: string;
}

const PricelistCard = ({ id, plan, onDelete }: CardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-lg overflow-hidden shadow-xl shadow-black/10">
      <div className="w-full flex flex-row items-center justify-center p-6 gap-2">
        <div className="w-1/2 flex flex-row gap-1 items-center justify-start">
          <RiFilePdfFill size={20} className="text-[#1d2087]" />

          <p className="font-semibold text-md cursor-pointer text-[#1d2087] hover:text-[#8f92ff] duration-300">
            {plan}
          </p>
        </div>
        <div className="w-1/2 flex flex-row items-center justify-end gap-2">
          <IconButton
            icon={<RiPencilFill size={14} />}
            action={() => {
              navigate(`/visas/files/edit/${id}`);
            }}
            title=""
            style="p-3 bg-[#1d2087] rounded-full text-white"
          />
          <IconButton
            icon={<RiDeleteBin4Fill size={14} />}
            action={onDelete}
            title=""
            style="p-3 bg-[#1d2087] rounded-full text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default PricelistCard;
