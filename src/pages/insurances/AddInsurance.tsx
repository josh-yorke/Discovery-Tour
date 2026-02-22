import Add from "../../components/insurances/Add";
import Navbar from "../../components/nav/Navbar";
import Header from "../../components/users/Header";

const AddInsurance = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Insurance"
        url="/insurances"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddInsurance;
