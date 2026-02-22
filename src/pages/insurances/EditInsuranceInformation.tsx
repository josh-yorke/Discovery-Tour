import { useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import Header from "../../components/users/Header";
import Edit from "../../components/insurances/information/edit/Edit";

const EditInsuranceInformation = () => {
  const { id } = useParams();

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Edit Insurance Information"
        url="/visas/visa"
        id={id ? id : ""}
      />
      <Edit />
    </div>
  );
};

export default EditInsuranceInformation;
