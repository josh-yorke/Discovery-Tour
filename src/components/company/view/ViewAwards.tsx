import type { companyAwards } from "../../../types/company/companyDataTypes";
import AwardCard from "../../cards/AwardCard";

const ViewAwards = ({ awards }: companyAwards) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-row gap-4">
        {awards.map((award) => (
          <AwardCard
            key={award._id}
            url={award.images}
            description={award.description}
            style="h-[40vh] max-w-full min-w-full md:max-w-[40vw] md:min-w-[40vw] rounded-lg"
            date={award.date}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewAwards;
