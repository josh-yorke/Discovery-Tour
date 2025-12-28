import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Add from "../../../components/visa/information/add/Add";

const AddInformation = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Visa Information"
        url="/visas/visa"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddInformation;
