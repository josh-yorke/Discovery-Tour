import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Edit from "../../../components/visa/information/edit/Edit";

const EditInformation = () => {
  const { id } = useParams();

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="py-6"
        title="Edit Information"
        url="/visas/visa"
        id={id ? id : ""}
      />
      <Edit />
    </div>
  );
};

export default EditInformation;
