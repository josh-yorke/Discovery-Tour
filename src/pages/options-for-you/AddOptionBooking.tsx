import Navbar from "../../components/nav/Navbar";
import Add from "../../components/options-for-you/add/Add";
import Header from "../../components/users/Header";

const AddOptionBooking = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Options for you booking"
        url="/options-for-you"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddOptionBooking;
