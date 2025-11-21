import Navbar from "../../../components/nav/Navbar";
import Add from "../../../components/promotions/add/Add";
import Header from "../../../components/users/Header";

const AddPromotion = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header style="p-6" title="Add Promotion" url="/promotions" id="" />
      <Add />
    </div>
  );
};

export default AddPromotion;
