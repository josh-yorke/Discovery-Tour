import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { updateVisaFile } from "../../../../hooks/visa/file/updateVisaFile";
import { addVisaFile } from "../../../../hooks/visa/file/addVisaFile";
import { getTerm } from "../../../../hooks/visa/terms/getTerm";
import { getPayment } from "../../../../hooks/visa/payment/getPayment";
import { getDocument } from "../../../../hooks/visa/document/getDocument";
import { getProcess } from "../../../../hooks/visa/process/getProcess";
import { getPricelist } from "../../../../hooks/visa/pricelist/getPriceList";
import { getVisaFile } from "../../../../hooks/visa/file/getVisaFile";
import ActionButton from "../../../button/ActionButton";
import FormTabs from "../add/FormTab";
import { updatePricelist } from "../../../../hooks/visa/pricelist/updatePricelist";
import { updateProcess } from "../../../../hooks/visa/process/updateProcess";
import { updatePayment } from "../../../../hooks/visa/payment/updatePayment";
import { updateTerm } from "../../../../hooks/visa/terms/updateTerm";
import { updateDocument } from "../../../../hooks/visa/document/updateDocument";
import { addProcess } from "../../../../hooks/visa/process/addProcess";
import { addPayment } from "../../../../hooks/visa/payment/addPayment";
import { addTerm } from "../../../../hooks/visa/terms/addTerm";
import { addDocument } from "../../../../hooks/visa/document/addDocument";
import EditDocumentForm, {
  type documentFormHandle,
} from "../../EditDocumentForm";
import EditTermForm, { type termFormHandle } from "../../EditTermForm";
import EditPaymentForm, { type PaymentFormHandle } from "../../EditPaymentForm";
import EditProcessForm, { type ProcessFormHandle } from "../../EditProcessForm";
import EditPricelistForm, {
  type PricelistFormHandle,
} from "../../EditPricelistForm";
import { addPriceList } from "../../../../hooks/visa/pricelist/addPriceList";
import PageLoader from "../../../loader/PageLoader";
import { deleteVisaFile } from "../../../../hooks/visa/file/deleteVisaFile";

export type FormType =
  | "pricelist"
  | "process"
  | "payment"
  | "term"
  | "document";

interface EditData {
  pricelist?: any;
  process?: any;
  payment?: any;
  term?: any;
  document?: any;
}

interface FileData {
  pricelist?: any;
  process?: any;
  term?: any;
  document?: any;
}

const Edit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams(); // Get visa ID from URL
  const [formType, setFormType] = useState<FormType>("pricelist");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editData, setEditData] = useState<EditData>({});
  const [fileData, setFileData] = useState<FileData>({});
  const [pricelistFileId, setPricelistFileId] = useState<string>("");
  const [processFileId, setProcessFileId] = useState<string>("");
  const [termFileId, setTermFileId] = useState<string>("");
  const [documentFileId, setDocumentFileId] = useState<string>("");
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const pricelistFormRef = useRef<PricelistFormHandle>(null);
  const processFormRef = useRef<ProcessFormHandle>(null);
  const paymentFormRef = useRef<PaymentFormHandle>(null);
  const termFormRef = useRef<termFormHandle>(null);
  const documentFormRef = useRef<documentFormHandle>(null);

  // Fetch visa file by ID
  const fetchVisaFile = async (fileId: string) => {
    if (!fileId) return null;
    try {
      const fileData = await getVisaFile(fileId);
      return fileData;
    } catch (error) {
      console.error(`Error fetching file with ID ${fileId}:`, error);
      return null;
    }
  };

  // Fetch existing data when component mounts
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!id) {
        console.error("No visa ID provided");
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);

        // Fetch all related data
        const [
          pricelistData,
          processData,
          paymentData,
          termData,
          documentData,
        ] = await Promise.all([
          getPricelist(id),
          getProcess(id),
          getPayment(id),
          getTerm(id),
          getDocument(id),
        ]);

        setEditData({
          pricelist: pricelistData,
          process: processData,
          payment: paymentData,
          term: termData,
          document: documentData,
        });

        console.log("Loaded edit data:", {
          pricelist: pricelistData,
          process: processData,
          payment: paymentData,
          term: termData,
          document: documentData,
        });

        // Set existing file IDs if available (skip payment)
        // In the useEffect where you set initial file IDs, update to handle arrays:
        if (pricelistData?.filesAssociated) {
          // Take the first file ID if it's an array, otherwise use the string
          const fileId = Array.isArray(pricelistData.filesAssociated)
            ? pricelistData.filesAssociated[0]
            : pricelistData.filesAssociated;
          setPricelistFileId(fileId);
        }

        if (processData?.filesAssociated) {
          const fileId = Array.isArray(processData.filesAssociated)
            ? processData.filesAssociated[0]
            : processData.filesAssociated;
          setProcessFileId(fileId);
        }

        if (termData?.filesAssociated) {
          const fileId = Array.isArray(termData.filesAssociated)
            ? termData.filesAssociated[0]
            : termData.filesAssociated;
          setTermFileId(fileId);
        }

        if (documentData?.filesAssociated) {
          const fileId = Array.isArray(documentData.filesAssociated)
            ? documentData.filesAssociated[0]
            : documentData.filesAssociated;
          setDocumentFileId(fileId);
        }

        // Fetch file data for each file ID (skip payment)
        const fileFetchPromises = [];

        if (pricelistData?.filesAssociated) {
          fileFetchPromises.push(
            fetchVisaFile(pricelistData.filesAssociated).then((file) => ({
              type: "pricelist",
              data: file,
            }))
          );
        }

        if (processData?.filesAssociated) {
          fileFetchPromises.push(
            fetchVisaFile(processData.filesAssociated).then((file) => ({
              type: "process",
              data: file,
            }))
          );
        }

        if (termData?.filesAssociated) {
          fileFetchPromises.push(
            fetchVisaFile(termData.filesAssociated).then((file) => ({
              type: "term",
              data: file,
            }))
          );
        }

        if (documentData?.filesAssociated) {
          fileFetchPromises.push(
            fetchVisaFile(documentData.filesAssociated).then((file) => ({
              type: "document",
              data: file,
            }))
          );
        }

        // Wait for all file fetches to complete
        const fileResults = await Promise.all(fileFetchPromises);

        // Organize file data by type (skip payment)
        const organizedFileData: FileData = {};
        fileResults.forEach((result) => {
          if (result.data) {
            organizedFileData[result.type as keyof FileData] = result.data;
          }
        });

        setFileData(organizedFileData);

        console.log("Loaded file data:", organizedFileData);
      } catch (error) {
        console.error("Error fetching edit data:", error);
        alert("Error loading existing data. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchExistingData();
  }, [id]);

  // File update mutation
  const fileMutation = useMutation<
    string,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => updateVisaFile(id, data),
  });

  // File add mutation
  const fileAddMutation = useMutation<string, Error, FormData>({
    mutationFn: addVisaFile,
  });

  // File delete mutation
  const fileDeleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteVisaFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"], exact: false });
    },
  });

  // Update mutations
  const pricelistUpdateMutation = useMutation<
    string,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => updatePricelist(id, data),
  });

  const processUpdateMutation = useMutation<
    string,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => updateProcess(id, data),
  });

  const paymentUpdateMutation = useMutation<
    string,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => updatePayment(id, data),
  });

  const termUpdateMutation = useMutation<
    string,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => updateTerm(id, data),
  });

  const documentUpdateMutation = useMutation<
    string,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => updateDocument(id, data),
  });

  // Add mutations
  const pricelistAddMutation = useMutation<string, Error, FormData>({
    mutationFn: addPriceList,
  });

  const processAddMutation = useMutation<string, Error, FormData>({
    mutationFn: addProcess,
  });

  const paymentAddMutation = useMutation<string, Error, FormData>({
    mutationFn: addPayment,
  });

  const termAddMutation = useMutation<string, Error, FormData>({
    mutationFn: addTerm,
  });

  const documentAddMutation = useMutation<string, Error, FormData>({
    mutationFn: addDocument,
  });

  // Upload or update file and return fileId
  const handleFile = async (
    fileData: File[],
    fileTitle: string,
    existingFileId?: string
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("type", "file");
    formData.append("fileTitle", fileTitle);

    Array.from(fileData).forEach((file: File) => {
      formData.append("file", file);
    });

    // If we have an existing file ID, update the file, otherwise create new
    if (existingFileId) {
      await fileMutation.mutateAsync({ id: existingFileId, data: formData });
      return existingFileId;
    } else {
      // Use addVisaFile for new files
      const fileId = await fileAddMutation.mutateAsync(formData);
      return fileId;
    }
  };

  // UPDATED DELETE FILE HANDLER - SIMPLIFIED APPROACH
  // UPDATED DELETE FILE HANDLER - PROPERLY HANDLES ARRAY FORMAT
  const handleDeleteFile = async (fileId: string, fileType: FormType) => {
    if (
      !fileId ||
      !window.confirm(`Are you sure you want to delete this ${fileType} file?`)
    ) {
      return;
    }

    try {
      setDeletingFileId(fileId);

      // Just delete the file and update local state
      await fileDeleteMutation.mutateAsync(fileId);

      // Update local state only - the filesAssociated will be handled when user saves the form
      switch (fileType) {
        case "pricelist":
          setPricelistFileId("");
          setFileData((prev) => ({ ...prev, pricelist: undefined }));
          // Also update editData to remove filesAssociated locally - set to empty array
          setEditData((prev) => ({
            ...prev,
            pricelist: prev.pricelist
              ? { ...prev.pricelist, filesAssociated: [] } // Set to empty array, not empty string
              : prev.pricelist,
          }));
          break;
        case "process":
          setProcessFileId("");
          setFileData((prev) => ({ ...prev, process: undefined }));
          setEditData((prev) => ({
            ...prev,
            process: prev.process
              ? { ...prev.process, filesAssociated: [] } // Set to empty array
              : prev.process,
          }));
          break;
        case "term":
          setTermFileId("");
          setFileData((prev) => ({ ...prev, term: undefined }));
          setEditData((prev) => ({
            ...prev,
            term: prev.term
              ? { ...prev.term, filesAssociated: [] } // Set to empty array
              : prev.term,
          }));
          break;
        case "document":
          setDocumentFileId("");
          setFileData((prev) => ({ ...prev, document: undefined }));
          setEditData((prev) => ({
            ...prev,
            document: prev.document
              ? { ...prev.document, filesAssociated: [] } // Set to empty array
              : prev.document,
          }));
          break;
      }

      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    } finally {
      setDeletingFileId(null);
    }
  };

  // Get the appropriate mutation function (add or update)
  const getMutationFunction = (type: string, hasExistingData: boolean) => {
    const updateMutations = {
      pricelist: pricelistUpdateMutation,
      process: processUpdateMutation,
      payment: paymentUpdateMutation,
      term: termUpdateMutation,
      document: documentUpdateMutation,
    };

    const addMutations = {
      pricelist: pricelistAddMutation,
      process: processAddMutation,
      payment: paymentAddMutation,
      term: termAddMutation,
      document: documentAddMutation,
    };

    // Map the form types to the correct mutation keys
    const typeMapping: Record<string, keyof typeof updateMutations> = {
      price: "pricelist",
      process: "process",
      payment: "payment",
      terms: "term",
      document: "document",
    };

    const mutationKey = typeMapping[type] || type;

    if (hasExistingData) {
      const mutation =
        updateMutations[mutationKey as keyof typeof updateMutations];
      if (!mutation) {
        throw new Error(`Invalid update form type: ${type}`);
      }
      return mutation;
    } else {
      const mutation = addMutations[mutationKey as keyof typeof addMutations];
      if (!mutation) {
        throw new Error(`Invalid add form type: ${type}`);
      }
      return mutation;
    }
  };

  // Handle final submission of all forms with file updates
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const visaId = id;

      if (!visaId) {
        alert("No visa ID found. Please select a visa first.");
        setIsSubmitting(false);
        return;
      }

      // Get form data from all forms using refs
      const pricelistFormData = await pricelistFormRef.current?.getFormData();
      const processFormData = await processFormRef.current?.getFormData();
      const paymentFormData = await paymentFormRef.current?.getFormData();
      const termFormData = await termFormRef.current?.getFormData();
      const documentFormData = await documentFormRef.current?.getFormData();

      if (
        !pricelistFormData ||
        !processFormData ||
        !paymentFormData ||
        !termFormData ||
        !documentFormData
      ) {
        alert("Please fix all form errors before submitting.");
        setIsSubmitting(false);
        return;
      }

      const { pricelistData, pricelistFileData } = pricelistFormData;
      const { processData, processFileData } = processFormData;
      const { paymentData } = paymentFormData;
      const { termData, termFileData } = termFormData;
      const { documentData, documentFileData } = documentFormData;

      console.log("Processing files...");

      // Handle files - update existing or create new (skip payment)
      const fileHandlingPromises = [];

      if (pricelistFileData.file && pricelistFileData.file.length > 0) {
        fileHandlingPromises.push(
          handleFile(
            pricelistFileData.file,
            pricelistFileData.fileTitle,
            pricelistFileId
          )
        );
      } else {
        fileHandlingPromises.push(Promise.resolve(pricelistFileId || ""));
      }

      if (processFileData.file && processFileData.file.length > 0) {
        fileHandlingPromises.push(
          handleFile(
            processFileData.file,
            processFileData.fileTitle,
            processFileId
          )
        );
      } else {
        fileHandlingPromises.push(Promise.resolve(processFileId || ""));
      }

      // Skip payment file handling
      fileHandlingPromises.push(Promise.resolve(""));

      if (termFileData.file && termFileData.file.length > 0) {
        fileHandlingPromises.push(
          handleFile(termFileData.file, termFileData.fileTitle, termFileId)
        );
      } else {
        fileHandlingPromises.push(Promise.resolve(termFileId || ""));
      }

      if (documentFileData.file && documentFileData.file.length > 0) {
        fileHandlingPromises.push(
          handleFile(
            documentFileData.file,
            documentFileData.fileTitle,
            documentFileId
          )
        );
      } else {
        fileHandlingPromises.push(Promise.resolve(documentFileId || ""));
      }

      const [
        pricelistFileIdResult,
        processFileIdResult,
        paymentFileIdResult,
        termFileIdResult,
        documentFileIdResult,
      ] = await Promise.all(fileHandlingPromises);

      console.log("Files processed:", {
        pricelistFileId: pricelistFileIdResult,
        processFileId: processFileIdResult,
        paymentFileId: paymentFileIdResult,
        termFileId: termFileIdResult,
        documentFileId: documentFileIdResult,
      });

      // Update state with new file IDs (in case new files were created)
      setPricelistFileId(pricelistFileIdResult);
      setProcessFileId(processFileIdResult);
      setTermFileId(termFileIdResult);
      setDocumentFileId(documentFileIdResult);

      // Prepare form data submissions for update or add
      const submissions = [
        {
          type: "price" as const,
          data: pricelistData,
          fileId: pricelistFileIdResult,
          existingData: editData.pricelist,
        },
        {
          type: "process" as const,
          data: processData,
          fileId: processFileIdResult,
          existingData: editData.process,
        },
        {
          type: "payment" as const,
          data: paymentData,
          fileId: "",
          existingData: editData.payment,
        },
        {
          type: "terms" as const,
          data: termData,
          fileId: termFileIdResult,
          existingData: editData.term,
        },
        {
          type: "document" as const,
          data: documentData,
          fileId: documentFileIdResult,
          existingData: editData.document,
        },
      ];

      // Create and execute update/add mutations
      // In the handleFinalSubmit function, fix the fileId check:
      // In the handleFinalSubmit function, fix the fileId check to handle arrays:
      const mutationPromises = submissions.map(
        ({ type, data, fileId, existingData }) => {
          const hasExistingData = !!existingData?._id;
          const mutation = getMutationFunction(type, hasExistingData);

          const formData = new FormData();
          formData.append("type", type);
          formData.append("visa", visaId); // Always send visa ID

          // FIX: Handle fileId whether it's a string or array
          if (fileId) {
            // If fileId is an array, take the first element (or handle as needed)
            const effectiveFileId = Array.isArray(fileId)
              ? fileId[0] || ""
              : fileId;

            // Only append if not empty
            if (effectiveFileId.trim() !== "") {
              formData.append("filesAssociated", effectiveFileId);
            }
          }

          // Add type-specific fields
          switch (type) {
            case "price":
              formData.append("plan", data.plan);
              formData.append("fee", data.fee);
              formData.append("description", data.description);
              break;
            case "process":
              formData.append("processTitle", data.processTitle);
              formData.append("process", data.process);
              break;
            case "payment":
              formData.append("paymentType", data.paymentType);
              formData.append("currency", data.currency);
              formData.append("accountName", data.accountName);
              formData.append("bankName", data.bankName);
              formData.append("accountNo", data.accountNo);
              formData.append("bankAddress", data.bankAddress);
              formData.append("swiftCode", data.swiftCode);
              break;
            case "terms":
              formData.append("title", data.title);
              formData.append("terms", data.terms);
              break;
            case "document":
              formData.append("docTitle", data.docTitle);
              formData.append("docDescription", data.docDescription);
              break;
          }

          if (hasExistingData) {
            // Update existing record
            return (mutation as typeof pricelistUpdateMutation).mutateAsync({
              id: existingData._id,
              data: formData,
            });
          } else {
            // Create new record
            return (mutation as typeof pricelistAddMutation).mutateAsync(
              formData
            );
          }
        }
      );

      console.log("Updating/creating all forms...");

      // Execute all mutations
      await Promise.all(mutationPromises);

      console.log("All updates/creations completed successfully");

      // Invalidate queries and navigate on success
      queryClient.invalidateQueries({ queryKey: ["pricelist"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["process"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["payment"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["term"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["document"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["files"], exact: false });

      alert("Visa information updated successfully!");
      navigate("/visas/visa");
    } catch (error) {
      console.error("Update error:", error);
      alert("There was an error updating the forms. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get loading state
  const isLoading = isLoadingData || isSubmitting;

  if (isLoadingData) return <PageLoader />;

  return (
    <div className="w-full min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100">
      <FormTabs formType={formType} setFormType={setFormType} />

      {/* Pricelist Section */}
      <div
        className={`w-full ${formType === "pricelist" ? "block" : "hidden"}`}
      >
        <EditPricelistForm
          ref={pricelistFormRef}
          editData={editData.pricelist}
          fileData={fileData.pricelist}
          onDeleteFile={
            pricelistFileId
              ? () => handleDeleteFile(pricelistFileId, "pricelist")
              : undefined
          }
          isDeleting={deletingFileId === pricelistFileId}
        />
      </div>

      {/* Process Section */}
      <div className={`w-full ${formType === "process" ? "block" : "hidden"}`}>
        <EditProcessForm
          ref={processFormRef}
          editData={editData.process}
          fileData={fileData.process}
          onDeleteFile={
            processFileId
              ? () => handleDeleteFile(processFileId, "process")
              : undefined
          }
          isDeleting={deletingFileId === processFileId}
        />
      </div>

      {/* Payment Section */}
      <div className={`w-full ${formType === "payment" ? "block" : "hidden"}`}>
        <EditPaymentForm ref={paymentFormRef} editData={editData.payment} />
      </div>

      {/* Term Section */}
      <div className={`w-full ${formType === "term" ? "block" : "hidden"}`}>
        <EditTermForm
          ref={termFormRef}
          editData={editData.term}
          fileData={fileData.term}
          onDeleteFile={
            termFileId ? () => handleDeleteFile(termFileId, "term") : undefined
          }
          isDeleting={deletingFileId === termFileId}
        />
      </div>

      {/* Document Section */}
      <div className={`w-full ${formType === "document" ? "block" : "hidden"}`}>
        <EditDocumentForm
          ref={documentFormRef}
          editData={editData.document}
          fileData={fileData.document}
          onDeleteFile={
            documentFileId
              ? () => handleDeleteFile(documentFileId, "document")
              : undefined
          }
          isDeleting={deletingFileId === documentFileId}
        />
      </div>

      {/* Single Update Button */}
      <div className="w-full ">
        <ActionButton
          action={handleFinalSubmit}
          isLoading={isLoading}
          title="Update All Visa Information"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 w-full"
        />
      </div>
    </div>
  );
};

export default Edit;
