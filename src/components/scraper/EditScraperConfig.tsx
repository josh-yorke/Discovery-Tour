import { useParams } from "react-router";
import Navbar from "../nav/Navbar";
import Header from "../users/Header";
import Edit from "./edit/Edit";
const EditScraper = () => {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <div className="h-screen w-full flex flex-col items-center justify-start bg-gray-100">
        <Header
          style="px-6 lg:px-0 py-6"
          title="Edit Scraper Config"
          url="/company/scraper"
          id={id ? id : ""}
        />
        <Edit />
      </div>
    </>
  );
};

export default EditScraper;
