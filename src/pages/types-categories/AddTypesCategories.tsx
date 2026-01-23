import Navbar from "../../components/nav/Navbar";
import Add from "../../components/types-categories/Add";
import Header from "../../components/users/Header";

const AddTypesCategories = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Types and Categories"
        url="/types-categories"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddTypesCategories;
