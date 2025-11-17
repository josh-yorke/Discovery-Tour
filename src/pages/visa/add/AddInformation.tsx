import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Add from "../../../components/visa/information/add/Add";

const AddInformation = () => {
  return (
    <>
      <Navbar />
      <Header title="Add Visa Information" url="/visas/visa" id="" />
      <Add />
    </>
  );
};

export default AddInformation;
