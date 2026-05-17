import Navbar from "../../../components/nav/Navbar";
import Add from "../../../components/news/add/Add";
import Header from "../../../components/users/Header";

const AddNews = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="px-6 lg:px-0 py-6"
        title="Add Happening"
        url="/news"
        id=""
      />
      <Add />
    </div>
  );
};

export default AddNews;
