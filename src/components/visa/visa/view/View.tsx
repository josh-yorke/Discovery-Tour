import {
  RiDeleteBin4Fill,
  RiInformationFill,
  RiPencilFill,
} from "react-icons/ri";
import type { visaData } from "../../../../types/visa/visaDataTypes";
import Documents from "../../../../pages/visa/view/sections/Documents";
import Processes from "../../../../pages/visa/view/sections/Processes";
import Pricelists from "../../../../pages/visa/view/sections/Pricelists";
import Terms from "../../../../pages/visa/view/sections/Terms";
import Payments from "../../../../pages/visa/view/sections/Payments";
import IconButton from "../../../button/IconButton";
import Faqs from "../../../../pages/visa/view/sections/Faqs";
import ConversionRates from "../../../../pages/visa/view/sections/ConversionRates";
import { useNavigate } from "react-router";
import TitleText from "../../../cards/TitleText";

interface ViewProps extends visaData {
  savedAt: string;
  onDelete: (_id: string) => void;
}

const View = ({ _id, mainDescription, onDelete, country, type }: ViewProps) => {
  const navigate = useNavigate();

  const hasDescription = mainDescription && mainDescription.trim() !== "";

  return (
    <>
      <div className="w-full flex flex-col gap-6 ">
        <div className="w-full flex flex-row gap-2">
          <IconButton
            style="px-3 py-2 rounded-full bg-gray-200"
            action={() => {
              navigate(`/visas/visa/edit/${_id}`);
            }}
            title="Edit"
            icon={<RiPencilFill size={16} />}
          />
          <IconButton
            style="px-3 py-2 rounded-full bg-gray-200"
            action={() => onDelete(_id)}
            title="Delete"
            icon={<RiDeleteBin4Fill size={16} />}
          />
        </div>
        <TitleText style="text-[#1d2087]" title={`${country} - ${type} Visa`} />

        {hasDescription && (
          <div className="w-full bg-white p-4 sm:p-6 rounded-3xl flex flex-col items-center gap-4">
            <div className="w-full flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-[#1d2087] to-[#393ca3] rounded-full">
                <RiInformationFill size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-base md:text-lg font-semibold text-black uppercase">
                  Visa Description
                </p>
              </div>
            </div>

            <div className="w-full border-b border-black/6" />

            <div className="w-full">
              <pre className="text-sm font-normal text-gray-800 whitespace-pre-wrap font-sans">
                {mainDescription}
              </pre>
            </div>
          </div>
        )}

        <Documents visaId={_id} />
        <Processes visaId={_id} />
        <Pricelists visaId={_id} />
        <Terms visaId={_id} />
        <Payments visaId={_id} />
        <Faqs idType="visaId" id={_id} />
        <ConversionRates />
      </div>
    </>
  );
};

export default View;
