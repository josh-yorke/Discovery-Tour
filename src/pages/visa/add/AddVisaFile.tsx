import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Add from "../../../components/visa/file/add/Add";

const AddVisaFile = () => {
  return (
    <>
      <Navbar />
      <Header title="Add Visa File" url="/visas/files" id="" />
      <Add />
    </>
  );
};

export default AddVisaFile;
