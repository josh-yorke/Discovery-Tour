import Add from "../../components/insurances/information/add/Add";
import Navbar from "../../components/nav/Navbar";
import Header from "../../components/users/Header";

const AddInsuranceInformation = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Insurance Information"
        url="/visas/visa"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddInsuranceInformation;
