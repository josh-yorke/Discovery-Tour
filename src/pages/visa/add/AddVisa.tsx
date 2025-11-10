import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Add from "../../../components/visa/visa/add/Add";

const AddVisa = () => {
  return (
    <>
      <Navbar />
      <Header title="Add Visa" url="/visas/visa" id="" />
      <Add />
    </>
  );
};

export default AddVisa;
