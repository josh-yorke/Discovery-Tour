import type { companyAwards } from "../../../types/company/companyDataTypes";
import AwardCard from "../../cards/AwardCard";

const ViewAwards = ({ awards }: companyAwards) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {awards.map((award) => (
        <AwardCard
          key={award._id}
          url={award.images}
          description={award.description}
          style="h-[40vh] w-full rounded-lg"
          date={award.date}
        />
      ))}
    </div>
  );
};

export default ViewAwards;
