import Navbar from "../../../components/nav/Navbar";
import Add from "../../../components/users/add/Add";
import Header from "../../../components/users/Header";

const AddUser = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header style="py-6" title="Add User" url="/users" id="" />
      <Add />
    </div>
  );
};

export default AddUser;
