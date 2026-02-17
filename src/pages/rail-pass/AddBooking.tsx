import Navbar from "../../components/nav/Navbar";
import Add from "../../components/rail-pass/booking/Add";
import Header from "../../components/users/Header";

const AddBooking = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Booking"
        url="/transport/booking"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddBooking;
