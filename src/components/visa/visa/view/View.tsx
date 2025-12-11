import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import type { visaData } from "../../../../types/visa/visaDataTypes";
import IconButton from "../../../button/IconButton";
import TitleText from "../../../cards/TitleText";
import Documents from "../../../../pages/visa/view/sections/Documents";
import Processes from "../../../../pages/visa/view/sections/Processes";
import Pricelists from "../../../../pages/visa/view/sections/Pricelists";
import Terms from "../../../../pages/visa/view/sections/Terms";
import Payments from "../../../../pages/visa/view/sections/Payments";

interface ViewProps extends visaData {
  savedAt: string;
  onDelete: (_id: string) => void;
}

const View = ({
  onDelete,
  country,
  _id,
  mainDescription,
  eligibleApplicants,
  type,
}: ViewProps) => {
  return (
    <>
      <div className="w-full flex flex-col gap-12 ">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <TitleText style="" title={country} />

          <div className="w-full flex flex-row gap-2">
            <IconButton
              style="px-3 py-2 rounded-sm bg-gray-200"
              action={() => {
                window.open(`/visas/visa/edit/${_id}`, "_blank");
              }}
              title="Edit"
              icon={<RiPencilFill size={16} />}
            />
            <IconButton
              style="px-3 py-2 rounded-sm bg-gray-200"
              action={() => onDelete(_id)}
              title="Delete"
              icon={<RiDeleteBin4Fill size={16} />}
            />
          </div>
        </div>
        <div
          className="w-full bg-white p-6 rounded-lg flex flex-col items-center gap-4"
          id="information"
        >
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start">
              <p className="text-xl font-semibold text-black uppercase">
                {country}
              </p>
            </div>
          </div>

          <div className="w-full border-b border-black/6" />

          <div className="w-full flex flex-col gap-2">
            <p className="text-base font-semibold text-[#1d2087]">Visa Type</p>
            <p className="text-sm font-normal">{type}</p>
          </div>

          <div className="w-full border-b border-black/6" />

          <div className="w-full flex flex-col gap-2">
            <p className="text-base font-semibold text-[#1d2087]">
              Visa Description
            </p>
            <p className="text-sm font-normal">{mainDescription}</p>
          </div>

          <div className="w-full border-b border-black/6" />

          <div className="w-full flex flex-col gap-2">
            <p className="text-base font-semibold text-[#1d2087]">
              Eligible Applicants
            </p>
            <p className="text-sm font-normal">{eligibleApplicants}</p>
          </div>
        </div>

        <Documents visaId={_id} />
        <Processes visaId={_id} />
        <Pricelists visaId={_id} />
        <Terms visaId={_id} />
        <Payments visaId={_id} />
      </div>
    </>
  );
};

export default View;
