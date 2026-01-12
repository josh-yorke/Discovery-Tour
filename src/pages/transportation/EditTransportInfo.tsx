import { useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import Header from "../../components/users/Header";
import Edit from "../../components/transportation/information/edit/Edit";

const EditTransportInfo = () => {
  const { id } = useParams();

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <Header
        style="py-6"
        title="Edit Transport Information"
        url="/transport/transportation"
        id={id ? id : ""}
      />
      <Edit />
    </div>
  );
};

export default EditTransportInfo;
