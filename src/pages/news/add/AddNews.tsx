import Navbar from "../../../components/nav/Navbar";
import Add from "../../../components/news/add/Add";
import Header from "../../../components/users/Header";

const AddNews = () => {
  return (
    <>
      <Navbar />
      <Header title="Add News" url="/news" id="" />
      <Add />
    </>
  );
};

export default AddNews;
