import Navbar from "../../../components/nav/Navbar";
import Add from "../../../components/promotions/add/Add";
import Header from "../../../components/users/Header";

const AddPromotion = () => {
  return (
    <>
      <Navbar />
      <Header title="Add Promotions" url="/promotions" id="" />
      <Add />
    </>
  );
};

export default AddPromotion;
