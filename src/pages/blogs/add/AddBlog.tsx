import Add from "../../../components/blogs/add/Add";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";

const AddBlog = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header style="p-6" title="Add Blog" url="/blogs" id="" />
      <Add />
    </div>
  );
};

export default AddBlog;
