import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Edit from "../../../components/markups/edit/Edit";

const EditMarkup = () => {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <div className="h-screen w-full flex flex-col items-center justify-start bg-gray-100">
        <Header
          style="px-6 lg:px-0 py-6"
          title="Edit Markup"
          url="/company/markups"
          id={id ? id : ""}
        />
        <Edit />
      </div>
    </>
  );
};

export default EditMarkup;
