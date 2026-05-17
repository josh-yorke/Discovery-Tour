import { useState } from "react";
import { RiPencilLine, RiResetRightFill } from "react-icons/ri";
import IconButton from "../../button/IconButton";
import { useNavigate } from "react-router";
import ScraperModal from "../../modal/ScraperModal";

const ScraperSearch = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="">
          <p className="text-md font-semibold text-[#1d2087]">
            Manage Scraped Data
          </p>
        </div>
        <IconButton
          icon={<RiPencilLine size={16} />}
          title="Edit Configuration"
          action={() => navigate("/company/scraper/edit")}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
        <IconButton
          icon={<RiResetRightFill size={16} />}
          title="Trigger Configuration"
          action={() => setIsModalOpen(true)}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-full"
        />
      </div>

      <ScraperModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ScraperSearch;
