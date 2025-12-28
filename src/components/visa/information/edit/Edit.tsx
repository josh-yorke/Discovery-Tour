import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useState, useRef, useEffect, useCallback } from "react";
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
  type DocumentFormHandle,
} from "../../EditDocumentForm";
import EditTermForm, { type TermFormHandle } from "../../EditTermForm";
import EditPaymentForm, { type PaymentFormHandle } from "../../EditPaymentForm";
import EditProcessForm, { type ProcessFormHandle } from "../../EditProcessForm";
import EditPricelistForm, {
  type PricelistFormHandle,
} from "../../EditPricelistForm";
import { addPriceList } from "../../../../hooks/visa/pricelist/addPriceList";
import PageLoader from "../../../loader/PageLoader";
import { deleteVisaFile } from "../../../../hooks/visa/file/deleteVisaFile";
import { deletePricelist } from "../../../../hooks/visa/pricelist/deletePriceList";
import { deleteProcess } from "../../../../hooks/visa/process/deleteProcess";
import { deleteTerm } from "../../../../hooks/visa/terms/deleteTerm";
import { deleteDocument } from "../../../../hooks/visa/document/deleteDocument";
import { deletePayment } from "../../../../hooks/visa/payment/deletePayment";
import Modal from "../../../modal/Modal";

// Types
export type FormType =
  | "pricelist"
  | "process"
  | "payment"
  | "term"
  | "document";

interface EditData {
  pricelist?: any[];
  process?: any[];
  payment?: any[];
  term?: any[];
  document?: any[];
}

interface FileData {
  pricelist?: any[];
  process?: any[];
  term?: any[];
  document?: any[];
}

type FileFetchResult =
  | { type: "pricelist"; data: any; index: number }
  | { type: "process"; data: any; index: number }
  | { type: "term"; data: any; index: number }
  | { type: "document"; data: any; index: number };

interface FormSubmission {
  type: "price" | "process" | "payment" | "terms" | "document";
  data: any;
  fileId: string;
  existingData: any;
}

interface ErrorState {
  message: string;
  type: "error" | "success";
  action?: "addOrUpdate" | "delete";
}

// Constants
const FORM_TYPES: FormType[] = [
  "pricelist",
  "process",
  "payment",
  "term",
  "document",
];

// Custom hook for data fetching
const useEditData = (id: string | undefined) => {
  const [editData, setEditData] = useState<EditData>({});
  const [fileData, setFileData] = useState<FileData>({});
  const [pricelistFileIds, setPricelistFileIds] = useState<string[][]>([]);
  const [processFileIds, setProcessFileIds] = useState<string[][]>([]);
  const [termFileIds, setTermFileIds] = useState<string[][]>([]);
  const [documentFileIds, setDocumentFileIds] = useState<string[][]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchVisaFile = useCallback(async (fileId: string): Promise<any> => {
    if (!fileId) return null;
    try {
      return await getVisaFile(fileId);
    } catch (error) {
      console.error(`Error fetching file with ID ${fileId}:`, error);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!id) {
        console.error("No visa ID provided");
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);

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

        const pricelistArray = Array.isArray(pricelistData)
          ? pricelistData
          : [pricelistData].filter(Boolean);

        const processArray = Array.isArray(processData)
          ? processData
          : [processData].filter(Boolean);

        const termArray = Array.isArray(termData)
          ? termData
          : [termData].filter(Boolean);

        const documentArray = Array.isArray(documentData)
          ? documentData
          : [documentData].filter(Boolean);

        const paymentArray = Array.isArray(paymentData)
          ? paymentData
          : [paymentData].filter(Boolean);

        setEditData({
          pricelist: pricelistArray,
          process: processArray,
          payment: paymentArray,
          term: termArray,
          document: documentArray,
        });

        // Handle file IDs for pricelist
        const pricelistFileIdsArray = pricelistArray.map((pricelist) =>
          pricelist?.filesAssociated
            ? Array.isArray(pricelist.filesAssociated)
              ? pricelist.filesAssociated
              : [pricelist.filesAssociated]
            : []
        );

        setPricelistFileIds(pricelistFileIdsArray);

        // Handle file IDs for process
        const processFileIdsArray = processArray.map((processItem) =>
          processItem?.filesAssociated
            ? Array.isArray(processItem.filesAssociated)
              ? processItem.filesAssociated
              : [processItem.filesAssociated]
            : []
        );

        setProcessFileIds(processFileIdsArray);

        // Handle file IDs for term
        const termFileIdsArray = termArray.map((termItem) =>
          termItem?.filesAssociated
            ? Array.isArray(termItem.filesAssociated)
              ? termItem.filesAssociated
              : [termItem.filesAssociated]
            : []
        );

        setTermFileIds(termFileIdsArray);

        // Handle file IDs for document
        const documentFileIdsArray = documentArray.map((documentItem) =>
          documentItem?.filesAssociated
            ? Array.isArray(documentItem.filesAssociated)
              ? documentItem.filesAssociated
              : [documentItem.filesAssociated]
            : []
        );

        setDocumentFileIds(documentFileIdsArray);

        // Fetch file data
        const fileFetchPromises: Promise<FileFetchResult>[] = [];

        // Pricelist files
        pricelistArray.forEach((pricelist, index) => {
          if (pricelist?.filesAssociated) {
            const fileId = Array.isArray(pricelist.filesAssociated)
              ? pricelist.filesAssociated[0]
              : pricelist.filesAssociated;
            fileFetchPromises.push(
              fetchVisaFile(fileId).then((file) => ({
                type: "pricelist" as const,
                data: file,
                index,
              }))
            );
          }
        });

        // Process files
        processArray.forEach((processItem, index) => {
          if (processItem?.filesAssociated) {
            const fileId = Array.isArray(processItem.filesAssociated)
              ? processItem.filesAssociated[0]
              : processItem.filesAssociated;
            fileFetchPromises.push(
              fetchVisaFile(fileId).then((file) => ({
                type: "process" as const,
                data: file,
                index,
              }))
            );
          }
        });

        // Term files
        termArray.forEach((termItem, index) => {
          if (termItem?.filesAssociated) {
            const fileId = Array.isArray(termItem.filesAssociated)
              ? termItem.filesAssociated[0]
              : termItem.filesAssociated;
            fileFetchPromises.push(
              fetchVisaFile(fileId).then((file) => ({
                type: "term" as const,
                data: file,
                index,
              }))
            );
          }
        });

        // Document files
        documentArray.forEach((documentItem, index) => {
          if (documentItem?.filesAssociated) {
            const fileId = Array.isArray(documentItem.filesAssociated)
              ? documentItem.filesAssociated[0]
              : documentItem.filesAssociated;
            fileFetchPromises.push(
              fetchVisaFile(fileId).then((file) => ({
                type: "document" as const,
                data: file,
                index,
              }))
            );
          }
        });

        const fileResults = await Promise.all(fileFetchPromises);
        const organizedFileData: FileData = {
          pricelist: [],
          process: [],
          term: [],
          document: [],
        };

        fileResults.forEach((result) => {
          if (result.type === "pricelist") {
            if (!organizedFileData.pricelist) organizedFileData.pricelist = [];
            organizedFileData.pricelist[result.index] = result.data;
          } else if (result.type === "process") {
            if (!organizedFileData.process) organizedFileData.process = [];
            organizedFileData.process[result.index] = result.data;
          } else if (result.type === "term") {
            if (!organizedFileData.term) organizedFileData.term = [];
            organizedFileData.term[result.index] = result.data;
          } else if (result.type === "document") {
            if (!organizedFileData.document) organizedFileData.document = [];
            organizedFileData.document[result.index] = result.data;
          }
        });

        setFileData(organizedFileData);
      } catch (error: any) {
        console.error("Error fetching edit data:", error);
        // We'll handle this error in the component level
        throw error;
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchExistingData();
  }, [id, fetchVisaFile]);

  return {
    editData,
    fileData,
    pricelistFileIds,
    processFileIds,
    termFileIds,
    documentFileIds,
    isLoadingData,
    setEditData,
    setFileData,
    setPricelistFileIds,
    setProcessFileIds,
    setTermFileIds,
    setDocumentFileIds,
  };
};

// Custom hook for mutations
const useFormMutations = () => {
  const queryClient = useQueryClient();

  const updateMutations = {
    pricelist: useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updatePricelist(id, data),
    }),
    process: useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateProcess(id, data),
    }),
    payment: useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updatePayment(id, data),
    }),
    term: useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateTerm(id, data),
    }),
    document: useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateDocument(id, data),
    }),
  };

  const addMutations = {
    pricelist: useMutation({ mutationFn: addPriceList }),
    process: useMutation({ mutationFn: addProcess }),
    payment: useMutation({ mutationFn: addPayment }),
    term: useMutation({ mutationFn: addTerm }),
    document: useMutation({ mutationFn: addDocument }),
  };

  // Delete mutations
  const deletePricelistMutation = useMutation({
    mutationFn: deletePricelist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricelist"], exact: false });
    },
  });

  const deleteProcessMutation = useMutation({
    mutationFn: deleteProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["process"], exact: false });
    },
  });

  const deleteTermMutation = useMutation({
    mutationFn: deleteTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["term"], exact: false });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document"], exact: false });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"], exact: false });
    },
  });

  const fileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateVisaFile(id, data),
  });

  const fileAddMutation = useMutation({ mutationFn: addVisaFile });

  const fileDeleteMutation = useMutation({
    mutationFn: deleteVisaFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"], exact: false });
    },
  });

  const invalidateQueries = useCallback(() => {
    FORM_TYPES.forEach((type) => {
      queryClient.invalidateQueries({ queryKey: [type], exact: false });
    });
    queryClient.invalidateQueries({ queryKey: ["files"], exact: false });
  }, [queryClient]);

  return {
    updateMutations,
    addMutations,
    deletePricelistMutation,
    deleteProcessMutation,
    deleteTermMutation,
    deleteDocumentMutation,
    deletePaymentMutation,
    fileMutation,
    fileAddMutation,
    fileDeleteMutation,
    invalidateQueries,
  };
};

// Fix the mutation parameter type issue
interface UpdateMutationParams {
  id: string;
  data: FormData;
}

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formType, setFormType] = useState<FormType>("pricelist");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deletingPricelistId, setDeletingPricelistId] = useState<string | null>(
    null
  );
  const [deletingProcessId, setDeletingProcessId] = useState<string | null>(
    null
  );
  const [deletingTermId, setDeletingTermId] = useState<string | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null
  );
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState<ErrorState | null>(null);

  const {
    editData,
    fileData,
    pricelistFileIds,
    processFileIds,
    termFileIds,
    documentFileIds,
    isLoadingData,
    setEditData,
    setFileData,
    setPricelistFileIds,
    setProcessFileIds,
    setTermFileIds,
    setDocumentFileIds,
  } = useEditData(id);

  const {
    updateMutations,
    addMutations,
    deletePricelistMutation,
    deleteProcessMutation,
    deleteTermMutation,
    deleteDocumentMutation,
    deletePaymentMutation,
    fileMutation,
    fileAddMutation,
    fileDeleteMutation,
    invalidateQueries,
  } = useFormMutations();

  const pricelistFormRef = useRef<PricelistFormHandle>(null);
  const processFormRef = useRef<ProcessFormHandle>(null);
  const paymentFormRef = useRef<PaymentFormHandle>(null);
  const termFormRef = useRef<TermFormHandle>(null);
  const documentFormRef = useRef<DocumentFormHandle>(null);

  const showMessage = useCallback((message: ErrorState | null) => {
    setMessage(message);
  }, []);

  // File handling
  const handleFile = useCallback(
    async (
      fileData: FileList | undefined,
      fileTitle: string | undefined,
      existingFileId?: string
    ): Promise<string> => {
      // If no file data and no existing file ID, return empty string
      if ((!fileData || fileData.length === 0) && !existingFileId) {
        return "";
      }

      // If no file data but we have existing file ID, return the existing ID
      if ((!fileData || fileData.length === 0) && existingFileId) {
        return existingFileId;
      }

      // If we have file data, proceed with upload/update
      const formData = new FormData();
      formData.append("type", "file");

      const finalFileTitle =
        fileTitle?.trim() || (existingFileId ? "Updated File" : "New File");
      formData.append("fileTitle", finalFileTitle);

      // FIX: Convert FileList to array properly
      const filesArray = Array.from(fileData!);
      filesArray.forEach((file: File) => {
        formData.append("file", file);
      });

      if (existingFileId) {
        try {
          await fileMutation.mutateAsync({
            id: existingFileId,
            data: formData,
          });
          return existingFileId;
        } catch (error: any) {
          showMessage({
            message: error.message || "Error updating file",
            type: "error",
            action: "addOrUpdate",
          });
          throw error;
        }
      } else {
        try {
          return await fileAddMutation.mutateAsync(formData);
        } catch (error: any) {
          showMessage({
            message: error.message || "Error uploading file",
            type: "error",
            action: "addOrUpdate",
          });
          throw error;
        }
      }
    },
    [fileMutation, fileAddMutation, showMessage]
  );

  // Function to handle pricelist deletion
  const handleDeletePricelist = useCallback(
    async (pricelistId: string, index: number) => {
      if (
        !pricelistId ||
        !window.confirm("Are you sure you want to delete this pricelist?")
      ) {
        return;
      }

      try {
        setDeletingPricelistId(pricelistId);
        await deletePricelistMutation.mutateAsync(pricelistId);

        // Remove the field from the form immediately using the exposed method
        if (pricelistFormRef.current) {
          const formHandle = pricelistFormRef.current as any;
          if (formHandle.removePricelistField) {
            formHandle.removePricelistField(index);
          }
        }

        // Update local state after successful deletion
        setEditData((prev) => ({
          ...prev,
          pricelist: prev.pricelist?.filter((_, i) => i !== index) || [],
        }));

        setFileData((prev) => ({
          ...prev,
          pricelist: prev.pricelist?.filter((_, i) => i !== index) || [],
        }));

        setPricelistFileIds((prev) => prev.filter((_, i) => i !== index));

        showMessage({
          message: "Pricelist deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting pricelist:", error);
        showMessage({
          message: error.message || "Error deleting pricelist",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingPricelistId(null);
      }
    },
    [
      deletePricelistMutation,
      setEditData,
      setFileData,
      setPricelistFileIds,
      showMessage,
    ]
  );

  // Function to handle process deletion
  const handleDeleteProcess = useCallback(
    async (processId: string, index: number) => {
      if (
        !processId ||
        !window.confirm("Are you sure you want to delete this process step?")
      ) {
        return;
      }

      try {
        setDeletingProcessId(processId);
        await deleteProcessMutation.mutateAsync(processId);

        // Remove the field from the form immediately using the exposed method
        if (processFormRef.current) {
          const formHandle = processFormRef.current as any;
          if (formHandle.removeProcessField) {
            formHandle.removeProcessField(index);
          }
        }

        // Update local state after successful deletion
        setEditData((prev) => ({
          ...prev,
          process: prev.process?.filter((_, i) => i !== index) || [],
        }));

        setFileData((prev) => ({
          ...prev,
          process: prev.process?.filter((_, i) => i !== index) || [],
        }));

        setProcessFileIds((prev) => prev.filter((_, i) => i !== index));

        showMessage({
          message: "Process step deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting process:", error);
        showMessage({
          message: error.message || "Error deleting process step",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingProcessId(null);
      }
    },
    [
      deleteProcessMutation,
      setEditData,
      setFileData,
      setProcessFileIds,
      showMessage,
    ]
  );

  // Function to handle term deletion
  const handleDeleteTerm = useCallback(
    async (termId: string, index: number) => {
      if (
        !termId ||
        !window.confirm("Are you sure you want to delete this term?")
      ) {
        return;
      }

      try {
        setDeletingTermId(termId);
        await deleteTermMutation.mutateAsync(termId);

        // Remove the field from the form immediately using the exposed method
        if (termFormRef.current) {
          const formHandle = termFormRef.current as any;
          if (formHandle.removeTermField) {
            formHandle.removeTermField(index);
          }
        }

        // Update local state after successful deletion
        setEditData((prev) => ({
          ...prev,
          term: prev.term?.filter((_, i) => i !== index) || [],
        }));

        setFileData((prev) => ({
          ...prev,
          term: prev.term?.filter((_, i) => i !== index) || [],
        }));

        setTermFileIds((prev) => prev.filter((_, i) => i !== index));

        showMessage({
          message: "Term deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting term:", error);
        showMessage({
          message: error.message || "Error deleting term",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingTermId(null);
      }
    },
    [deleteTermMutation, setEditData, setFileData, setTermFileIds, showMessage]
  );

  // Function to handle document deletion
  const handleDeleteDocument = useCallback(
    async (documentId: string, index: number) => {
      if (
        !documentId ||
        !window.confirm("Are you sure you want to delete this document?")
      ) {
        return;
      }

      try {
        setDeletingDocumentId(documentId);
        await deleteDocumentMutation.mutateAsync(documentId);

        // Remove the field from the form immediately using the exposed method
        if (documentFormRef.current) {
          const formHandle = documentFormRef.current as any;
          if (formHandle.removeDocumentField) {
            formHandle.removeDocumentField(index);
          }
        }

        // Update local state after successful deletion
        setEditData((prev) => ({
          ...prev,
          document: prev.document?.filter((_, i) => i !== index) || [],
        }));

        setFileData((prev) => ({
          ...prev,
          document: prev.document?.filter((_, i) => i !== index) || [],
        }));

        setDocumentFileIds((prev) => prev.filter((_, i) => i !== index));

        showMessage({
          message: "Document deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting document:", error);
        showMessage({
          message: error.message || "Error deleting document",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingDocumentId(null);
      }
    },
    [
      deleteDocumentMutation,
      setEditData,
      setFileData,
      setDocumentFileIds,
      showMessage,
    ]
  );

  // Function to handle payment deletion
  const handleDeletePayment = useCallback(
    async (paymentId: string, index: number) => {
      if (
        !paymentId ||
        !window.confirm("Are you sure you want to delete this payment method?")
      ) {
        return;
      }

      try {
        setDeletingPaymentId(paymentId);
        await deletePaymentMutation.mutateAsync(paymentId);

        // Remove the field from the form immediately using the exposed method
        if (paymentFormRef.current) {
          const formHandle = paymentFormRef.current as any;
          if (formHandle.removePaymentField) {
            formHandle.removePaymentField(index);
          }
        }

        // Update local state after successful deletion
        setEditData((prev) => ({
          ...prev,
          payment: prev.payment?.filter((_, i) => i !== index) || [],
        }));

        showMessage({
          message: "Payment method deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting payment:", error);
        showMessage({
          message: error.message || "Error deleting payment method",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingPaymentId(null);
      }
    },
    [deletePaymentMutation, setEditData, showMessage]
  );

  // UPDATED: Fixed handleDeleteFile function
  const handleDeleteFile = useCallback(
    async (fileId: string, fileType: FormType, index?: number) => {
      if (
        !fileId ||
        !window.confirm(
          `Are you sure you want to delete this ${fileType} file?`
        )
      ) {
        return;
      }

      try {
        setDeletingFileId(fileId);
        await fileDeleteMutation.mutateAsync(fileId);

        // Update local state - remove file from filesAssociated
        const updateState = {
          pricelist: () => {
            if (index !== undefined) {
              setPricelistFileIds((prev) => {
                const newFileIds = [...prev];
                if (newFileIds[index]) {
                  newFileIds[index] = newFileIds[index].filter(
                    (id) => id !== fileId
                  );
                }
                return newFileIds;
              });

              setEditData((prev) => ({
                ...prev,
                pricelist:
                  prev.pricelist?.map((pricelist, i) =>
                    i === index
                      ? {
                          ...pricelist,
                          filesAssociated:
                            pricelist.filesAssociated?.filter(
                              (id: any) => id !== fileId
                            ) || [],
                        }
                      : pricelist
                  ) || [],
              }));

              setFileData((prev) => ({
                ...prev,
                pricelist:
                  prev.pricelist?.map((file, i) =>
                    i === index ? undefined : file
                  ) || [],
              }));
            }
          },
          process: () => {
            if (index !== undefined) {
              setProcessFileIds((prev) => {
                const newFileIds = [...prev];
                if (newFileIds[index]) {
                  newFileIds[index] = newFileIds[index].filter(
                    (id) => id !== fileId
                  );
                }
                return newFileIds;
              });

              setEditData((prev) => ({
                ...prev,
                process:
                  prev.process?.map((processItem, i) =>
                    i === index
                      ? {
                          ...processItem,
                          filesAssociated:
                            processItem.filesAssociated?.filter(
                              (id: any) => id !== fileId
                            ) || [],
                        }
                      : processItem
                  ) || [],
              }));

              setFileData((prev) => ({
                ...prev,
                process:
                  prev.process?.map((file, i) =>
                    i === index ? undefined : file
                  ) || [],
              }));
            }
          },
          payment: () => {},
          term: () => {
            if (index !== undefined) {
              setTermFileIds((prev) => {
                const newFileIds = [...prev];
                if (newFileIds[index]) {
                  newFileIds[index] = newFileIds[index].filter(
                    (id) => id !== fileId
                  );
                }
                return newFileIds;
              });

              setEditData((prev) => ({
                ...prev,
                term:
                  prev.term?.map((termItem, i) =>
                    i === index
                      ? {
                          ...termItem,
                          filesAssociated:
                            termItem.filesAssociated?.filter(
                              (id: any) => id !== fileId
                            ) || [],
                        }
                      : termItem
                  ) || [],
              }));

              setFileData((prev) => ({
                ...prev,
                term:
                  prev.term?.map((file, i) =>
                    i === index ? undefined : file
                  ) || [],
              }));
            }
          },
          document: () => {
            if (index !== undefined) {
              setDocumentFileIds((prev) => {
                const newFileIds = [...prev];
                if (newFileIds[index]) {
                  newFileIds[index] = newFileIds[index].filter(
                    (id) => id !== fileId
                  );
                }
                return newFileIds;
              });

              setEditData((prev) => ({
                ...prev,
                document:
                  prev.document?.map((documentItem, i) =>
                    i === index
                      ? {
                          ...documentItem,
                          filesAssociated:
                            documentItem.filesAssociated?.filter(
                              (id: any) => id !== fileId
                            ) || [],
                        }
                      : documentItem
                  ) || [],
              }));

              setFileData((prev) => ({
                ...prev,
                document:
                  prev.document?.map((file, i) =>
                    i === index ? undefined : file
                  ) || [],
              }));
            }
          },
        };

        updateState[fileType]();
        showMessage({
          message: "File deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting file:", error);
        showMessage({
          message: error.message || "Error deleting file",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingFileId(null);
      }
    },
    [
      fileDeleteMutation,
      setEditData,
      setFileData,
      setPricelistFileIds,
      setProcessFileIds,
      setTermFileIds,
      setDocumentFileIds,
      showMessage,
    ]
  );

  // Form submission
  const getMutationFunction = useCallback(
    (type: string, hasExistingData: boolean) => {
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
        if (!mutation) throw new Error(`Invalid update form type: ${type}`);
        return mutation;
      } else {
        const mutation = addMutations[mutationKey as keyof typeof addMutations];
        if (!mutation) throw new Error(`Invalid add form type: ${type}`);
        return mutation;
      }
    },
    [updateMutations, addMutations]
  );

  // FIXED: Form submission with proper validation to prevent saving files without form data
  const handleFinalSubmit = useCallback(async () => {
    if (!id) {
      showMessage({
        message: "No visa ID found. Please select a visa first.",
        type: "error",
        action: "addOrUpdate",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get form data from all forms
      const [
        pricelistFormData,
        processFormData,
        paymentFormData,
        termFormData,
        documentFormData,
      ] = await Promise.all([
        pricelistFormRef.current?.getFormData(),
        processFormRef.current?.getFormData(),
        paymentFormRef.current?.getFormData(),
        termFormRef.current?.getFormData(),
        documentFormRef.current?.getFormData(),
      ]);

      // Helper function to check if form data has content
      const hasFormData = (formData: any, type: string): boolean => {
        if (!formData) return false;

        const fieldMap = {
          pricelist: "pricelistData",
          process: "processData",
          payment: "paymentData",
          term: "termData",
          document: "documentData",
        };

        const dataField = fieldMap[type as keyof typeof fieldMap];
        return (
          formData[dataField] &&
          Array.isArray(formData[dataField]) &&
          formData[dataField].length > 0
        );
      };

      // Check if ALL forms are empty
      const formChecks = [
        { data: pricelistFormData, type: "pricelist" },
        { data: processFormData, type: "process" },
        { data: paymentFormData, type: "payment" },
        { data: termFormData, type: "term" },
        { data: documentFormData, type: "document" },
      ];

      const allFormsEmpty = formChecks.every(
        ({ data, type }) => !hasFormData(data, type)
      );

      if (allFormsEmpty) {
        showMessage({
          message: "Please fill at least one form before submitting.",
          type: "error",
          action: "addOrUpdate",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare submissions for each form type only if they have data
      const submissions: FormSubmission[] = [];

      // Handle pricelist submissions if data exists
      if (hasFormData(pricelistFormData, "pricelist")) {
        const { pricelistData, pricelistFileData } = pricelistFormData!;

        // FIX: Only process files if there's corresponding form data
        let safePricelistFileData: any[] = [];
        if (Array.isArray(pricelistFileData)) {
          safePricelistFileData = pricelistFileData;
        } else if (pricelistFileData && typeof pricelistFileData === "object") {
          safePricelistFileData = [pricelistFileData];
        }

        // FIX: Ensure we only process files for existing form data entries
        const pricelistArray = Array.isArray(pricelistData)
          ? pricelistData
          : [pricelistData];

        const pricelistFilePromises = pricelistArray.map(async (_, index) => {
          const fileData = safePricelistFileData[index];
          const existingFileId = pricelistFileIds[index]?.[0] || "";

          // Only process file if there's actual file data AND form data exists for this index
          if (fileData?.file && fileData.file.length > 0) {
            return handleFile(
              fileData.file,
              fileData.fileTitle,
              existingFileId
            );
          }
          return existingFileId || "";
        });

        const pricelistFileIdResults = await Promise.all(pricelistFilePromises);
        setPricelistFileIds(pricelistFileIdResults.map((id) => [id]));

        const editPricelistArray = Array.isArray(editData.pricelist)
          ? editData.pricelist
          : [editData.pricelist].filter(Boolean);

        pricelistArray.forEach((data, index) => {
          // FIX: Only create submission if we have valid form data
          if (data && (data.plan || data.fee || data.description)) {
            submissions.push({
              type: "price",
              data,
              fileId: pricelistFileIdResults[index] || "",
              existingData: editPricelistArray[index],
            });
          }
        });
      }

      // Handle process submissions if data exists
      if (hasFormData(processFormData, "process")) {
        const { processData, processFileData } = processFormData!;

        let safeProcessFileData: any[] = [];
        if (Array.isArray(processFileData)) {
          safeProcessFileData = processFileData;
        } else if (processFileData && typeof processFileData === "object") {
          safeProcessFileData = [processFileData];
        }

        const processArray = Array.isArray(processData)
          ? processData
          : [processData];

        const processFilePromises = processArray.map(async (_, index) => {
          const fileData = safeProcessFileData[index];
          const existingFileId = processFileIds[index]?.[0] || "";

          if (fileData?.file && fileData.file.length > 0) {
            return handleFile(
              fileData.file,
              fileData.fileTitle,
              existingFileId
            );
          }
          return existingFileId || "";
        });

        const processFileIdResults = await Promise.all(processFilePromises);
        setProcessFileIds(processFileIdResults.map((id) => [id]));

        const editProcessArray = Array.isArray(editData.process)
          ? editData.process
          : [editData.process].filter(Boolean);

        processArray.forEach((data, index) => {
          if (data && (data.processTitle || data.process)) {
            submissions.push({
              type: "process",
              data,
              fileId: processFileIdResults[index] || "",
              existingData: editProcessArray[index],
            });
          }
        });
      }

      // Handle payment submissions if data exists
      if (hasFormData(paymentFormData, "payment")) {
        const { paymentData } = paymentFormData!;

        const paymentArray = Array.isArray(paymentData)
          ? paymentData
          : [paymentData];
        const editPaymentArray = Array.isArray(editData.payment)
          ? editData.payment
          : [editData.payment].filter(Boolean);

        paymentArray.forEach((data, index) => {
          if (
            data &&
            (data.paymentType || data.accountName || data.accountNo)
          ) {
            submissions.push({
              type: "payment",
              data,
              fileId: "", // Payment doesn't have files
              existingData: editPaymentArray[index],
            });
          }
        });
      }

      // Handle term submissions if data exists
      if (hasFormData(termFormData, "term")) {
        const { termData, termFileData } = termFormData!;

        let safeTermFileData: any[] = [];
        if (Array.isArray(termFileData)) {
          safeTermFileData = termFileData;
        } else if (termFileData && typeof termFileData === "object") {
          safeTermFileData = [termFileData];
        }

        const termArray = Array.isArray(termData) ? termData : [termData];

        const termFilePromises = termArray.map(async (_, index) => {
          const fileData = safeTermFileData[index];
          const existingFileId = termFileIds[index]?.[0] || "";

          if (fileData?.file && fileData.file.length > 0) {
            return handleFile(
              fileData.file,
              fileData.fileTitle,
              existingFileId
            );
          }
          return existingFileId || "";
        });

        const termFileIdResults = await Promise.all(termFilePromises);
        setTermFileIds(termFileIdResults.map((id) => [id]));

        const editTermArray = Array.isArray(editData.term)
          ? editData.term
          : [editData.term].filter(Boolean);

        termArray.forEach((data, index) => {
          if (data && (data.title || data.terms)) {
            submissions.push({
              type: "terms",
              data,
              fileId: termFileIdResults[index] || "",
              existingData: editTermArray[index],
            });
          }
        });
      }

      // Handle document submissions if data exists
      if (hasFormData(documentFormData, "document")) {
        const { documentData, documentFileData } = documentFormData!;

        let safeDocumentFileData: any[] = [];
        if (Array.isArray(documentFileData)) {
          safeDocumentFileData = documentFileData;
        } else if (documentFileData && typeof documentFileData === "object") {
          safeDocumentFileData = [documentFileData];
        }

        const documentArray = Array.isArray(documentData)
          ? documentData
          : [documentData];

        const documentFilePromises = documentArray.map(async (_, index) => {
          const fileData = safeDocumentFileData[index];
          const existingFileId = documentFileIds[index]?.[0] || "";

          if (fileData?.file && fileData.file.length > 0) {
            return handleFile(
              fileData.file,
              fileData.fileTitle,
              existingFileId
            );
          }
          return existingFileId || "";
        });

        const documentFileIdResults = await Promise.all(documentFilePromises);
        setDocumentFileIds(documentFileIdResults.map((id) => [id]));

        const editDocumentArray = Array.isArray(editData.document)
          ? editData.document
          : [editData.document].filter(Boolean);

        documentArray.forEach((data, index) => {
          if (data && (data.docTitle || data.docDescription)) {
            submissions.push({
              type: "document",
              data,
              fileId: documentFileIdResults[index] || "",
              existingData: editDocumentArray[index],
            });
          }
        });
      }

      // Execute mutations only for forms that have data
      const mutationPromises = submissions.map(
        ({ type, data, fileId, existingData }) => {
          const hasExistingData = !!existingData?._id;
          const mutation = getMutationFunction(type, hasExistingData);

          const formData = new FormData();
          formData.append("type", type);
          formData.append("visa", id);

          // FIX: Only add file association if we have a valid file ID
          if (fileId && fileId.trim() && fileId !== "undefined") {
            formData.append("filesAssociated", fileId);
          }

          const fieldMappings = {
            price: () => {
              formData.append("plan", data.plan || "");
              formData.append("fee", data.fee || "");
              formData.append("description", data.description || "");
            },
            process: () => {
              formData.append("processTitle", data.processTitle || "");
              formData.append("process", data.process || "");
            },
            payment: () => {
              formData.append("paymentType", data.paymentType || "");
              formData.append("currency", data.currency || "");
              formData.append("accountName", data.accountName || "");
              formData.append("bankName", data.bankName || "");
              formData.append("accountNo", data.accountNo || "");
              formData.append("bankAddress", data.bankAddress || "");
              formData.append("swiftCode", data.swiftCode || "");
            },
            terms: () => {
              formData.append("title", data.title || "");
              formData.append("terms", data.terms || "");
            },
            document: () => {
              formData.append("docTitle", data.docTitle || "");
              formData.append("docDescription", data.docDescription || "");
            },
          };

          fieldMappings[type]?.();

          if (hasExistingData) {
            const params: UpdateMutationParams = {
              id: existingData._id,
              data: formData,
            };
            return (mutation as any).mutateAsync(params);
          } else {
            return (mutation as any).mutateAsync(formData);
          }
        }
      );

      await Promise.all(mutationPromises);
      invalidateQueries();

      showMessage({
        message: "Visa information updated successfully!",
        type: "success",
        action: "addOrUpdate",
      });
    } catch (error: any) {
      console.error("Update error:", error);
      showMessage({
        message:
          error.message ||
          "There was an error updating the forms. Please try again.",
        type: "error",
        action: "addOrUpdate",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    id,
    editData,
    pricelistFileIds,
    processFileIds,
    termFileIds,
    documentFileIds,
    handleFile,
    getMutationFunction,
    invalidateQueries,
    setPricelistFileIds,
    setProcessFileIds,
    setTermFileIds,
    setDocumentFileIds,
    showMessage,
  ]);

  const isLoading = isLoadingData || isSubmitting;

  if (isLoadingData) return <PageLoader />;

  const formProps = {
    pricelist: {
      ref: pricelistFormRef,
      editData: editData.pricelist || [],
      fileData: fileData.pricelist || [],
      onDeleteFile: (index: number, fileId: string) =>
        handleDeleteFile(fileId, "pricelist", index),
      onDeletePricelist: handleDeletePricelist,
      isDeleting: deletingFileId !== null,
      isDeletingPricelist: deletingPricelistId !== null,
    },
    process: {
      ref: processFormRef,
      editData: editData.process || [],
      fileData: fileData.process || [],
      onDeleteFile: (index: number, fileId: string) =>
        handleDeleteFile(fileId, "process", index),
      onDeleteProcess: handleDeleteProcess,
      isDeleting: deletingFileId !== null,
      isDeletingProcess: deletingProcessId !== null,
    },
    payment: {
      ref: paymentFormRef,
      editData: editData.payment || [],
      onDeletePayment: handleDeletePayment,
      isDeletingPayment: deletingPaymentId !== null,
    },
    term: {
      ref: termFormRef,
      editData: editData.term || [],
      fileData: fileData.term || [],
      onDeleteFile: (index: number, fileId: string) =>
        handleDeleteFile(fileId, "term", index),
      onDeleteTerm: handleDeleteTerm,
      isDeleting: deletingFileId !== null,
      isDeletingTerm: deletingTermId !== null,
    },
    document: {
      ref: documentFormRef,
      editData: editData.document || [],
      fileData: fileData.document || [],
      onDeleteFile: (index: number, fileId: string) =>
        handleDeleteFile(fileId, "document", index),
      onDeleteDocument: handleDeleteDocument,
      isDeleting: deletingFileId !== null,
      isDeletingDocument: deletingDocumentId !== null,
    },
  };

  return (
    <div className="w-full min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100">
      {message && (
        <Modal
          message={message.message}
          success={message.type === "success"}
          action={() => {
            showMessage(null);
            // Only navigate for successful add/update operations, not for delete operations
            if (
              message.type === "success" &&
              message.action === "addOrUpdate"
            ) {
              navigate("/visas/visa");
            }
          }}
        />
      )}

      <FormTabs formType={formType} setFormType={setFormType} />

      {FORM_TYPES.map((type) => (
        <div
          key={type}
          className={`w-full lg:w-2xl ${
            formType === type ? "block" : "hidden"
          }`}
        >
          {type === "pricelist" && (
            <EditPricelistForm {...formProps.pricelist} />
          )}
          {type === "process" && <EditProcessForm {...formProps.process} />}
          {type === "payment" && <EditPaymentForm {...formProps.payment} />}
          {type === "term" && <EditTermForm {...formProps.term} />}
          {type === "document" && <EditDocumentForm {...formProps.document} />}
        </div>
      ))}

      <div className="w-full lg:w-2xl">
        <ActionButton
          action={handleFinalSubmit}
          isLoading={isLoading}
          title="Save Visa Information"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white text-sm duration-300 w-full"
        />
      </div>
    </div>
  );
};

export default Edit;
