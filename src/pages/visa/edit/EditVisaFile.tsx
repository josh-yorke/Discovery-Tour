import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import Header from "../../../components/users/Header";
import Edit from "../../../components/visa/file/edit/Edit";
import { getVisaFile } from "../../../hooks/visa/file/getVisaFile";
import { fetchFile } from "../../../utils/fetchFiles";

const EditVisaFile = () => {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["files", id],
    queryFn: () => getVisaFile(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log(data?.file);
    const getFile = async () => {
      const singleFile = await fetchFile(data?.file);
      setFile(singleFile);
    };

    getFile();
  }, [data]);

  return (
    <>
      <Navbar />

      {isLoading || isError ? (
        isError ? (
          <PageError title="Reload" action={refetch} error={error.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : null
      ) : (
        <>
          <Header
            style=""
            title="Edit Visa File"
            url="/visas/files"
            id={data._id}
          />
          <Edit id={data._id} file={file} fileTitle={data.fileTitle} />
        </>
      )}
    </>
  );
};

export default EditVisaFile;
