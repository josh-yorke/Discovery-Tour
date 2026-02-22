import Navbar from "../../../components/nav/Navbar";
import Add from "../../../components/partners/add/Add";
import Header from "../../../components/users/Header";

const AddPartner = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header style="px-6 lg:px-0 py-6" title="Add Partner" url="/news" id="" />
      <Add />
    </div>
  );
};

export default AddPartner;
