import Add from "../../components/careers/add/Add";
import Navbar from "../../components/nav/Navbar";
import Header from "../../components/users/Header";

const AddCareer = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Career"
        url="/careers"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddCareer;
