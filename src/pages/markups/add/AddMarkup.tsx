import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Add from "../../../components/markups/add/Add";

const AddMarkup = () => {
  return (
    <>
      <Navbar />

      <div className="h-screen w-full flex flex-col items-center justify-start bg-gray-100">
        <Header
          style="px-6 lg:px-0 py-6"
          title="Add Markup"
          url="/company/markups"
          id=""
        />
        <Add />
      </div>
    </>
  );
};

export default AddMarkup;
