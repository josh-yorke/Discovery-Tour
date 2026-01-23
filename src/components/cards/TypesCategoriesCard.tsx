import {
  RiCarFill,
  RiDeleteBin4Fill,
  RiCalendar2Fill,
  RiMapPin2Fill,
  RiUserFill,
  RiMailFill,
  RiPhoneFill,
  RiFileTextFill,
  RiFlagFill,
  RiFilePaperFill,
  RiMoneyDollarCircleFill,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiPencilFill,
} from "react-icons/ri";
import { useState } from "react";
import IconButton from "../button/IconButton";
import { useNavigate } from "react-router";
import LinkText from "../nav/LinkText";

interface CardProps {
  _id: string;
  visaType?: string;
  tourType?: string;
  transportType?: string;
  railPassType?: string;
  railPassCategory?: string;
  country?: string;
  savedAt: string;
  type: string;
  onDelete: () => void;
}

const TypesCategoriesCard = ({
  _id,
  savedAt,
  visaType,
  tourType,
  transportType,
  railPassType,
  railPassCategory,
  country,
  onDelete,
  type,
}: CardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white rounded-3xl p-4 gap-4 shadow-xl shadow-black/10">
      <div className="w-full flex items-center justify-between">
        <div className="w-full">
          <p className="font-bold text-[#1d2087] text-lg truncate">
            {visaType}
            {tourType}
            {transportType}
            {railPassType}
            {railPassCategory}
            {country}
          </p>
          <p className="text-xs font-normal text-gray-500">
            Added on {formatDate(savedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            action={() =>
              navigate(`/types-categories/edit/${_id}?type=${type}`)
            }
            title=""
            icon={<RiPencilFill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
          <IconButton
            action={onDelete}
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
            style="bg-gray-100 text-[#1d2087] rounded-full p-3 hover:bg-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default TypesCategoriesCard;
