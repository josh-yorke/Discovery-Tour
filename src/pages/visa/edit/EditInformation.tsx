import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Edit from "../../../components/visa/information/edit/Edit";

const EditInformation = () => {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <Header title="Edit Information" url="/visas/visa" id={id ? id : ""} />
      <Edit />
    </>
  );
};

export default EditInformation;
