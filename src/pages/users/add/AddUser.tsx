import Navbar from "../../../components/nav/Navbar";
import Add from "../../../components/users/add/Add";
import Header from "../../../components/users/Header";

const AddUser = () => {
  return (
    <>
      <Navbar />
      <Header title="Add User" url="/users" id="" />
      <Add />
    </>
  );
};

export default AddUser;
