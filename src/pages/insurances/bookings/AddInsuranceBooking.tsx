import Add from "../../../components/insurances/bookings/Add";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";

const AddInsuranceBooking = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Insurance Booking"
        url="/insurance/bookings/add"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddInsuranceBooking;
