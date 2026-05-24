import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Add from "../../../components/page-config/add/Add";

const AddPageConfig = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Page Config"
        url="/page-configs"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddPageConfig;
