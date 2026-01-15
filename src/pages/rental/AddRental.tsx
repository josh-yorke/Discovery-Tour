import Navbar from "../../components/nav/Navbar";
import Add from "../../components/rental/Add";
import Header from "../../components/users/Header";

const AddRental = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Rental"
        url="/transport/rental"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddRental;
