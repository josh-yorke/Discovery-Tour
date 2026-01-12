import Navbar from "../../components/nav/Navbar";
import Add from "../../components/transportation/Add";
import Header from "../../components/users/Header";

const AddTransport = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Transportation"
        url="/transport/transportation"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddTransport;
