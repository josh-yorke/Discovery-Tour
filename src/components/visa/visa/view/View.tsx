import { RiDeleteBin4Fill, RiPencilFill } from "react-icons/ri";
import type { visaData } from "../../../../types/visa/visaDataTypes";
import IconButton from "../../../button/IconButton";
import TitleText from "../../../cards/TitleText";

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
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-sm font-semibold">About this Visa:</p>
          <pre className="whitespace-pre-line text-sm font-normal font-sans">
            {mainDescription}
          </pre>
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-sm font-semibold">Eligible Applicants:</p>
          <p className="text-sm font-normal">{eligibleApplicants}</p>
        </div>
      </div>
    </>
  );
};

export default View;
