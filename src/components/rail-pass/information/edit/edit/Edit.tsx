import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { getVisaFile } from "../../../../../hooks/visa/file/getVisaFile";
import { getPassPricelist } from "../../../../../hooks/visa/pricelist/getPriceList";
import { getPassProcess } from "../../../../../hooks/visa/process/getProcess";
import { getPassPayment } from "../../../../../hooks/visa/payment/getPayment";
import { getPassTerm } from "../../../../../hooks/visa/terms/getTerm";
import { getPassDocument } from "../../../../../hooks/visa/document/getDocument";
import { getPassFaq } from "../../../../../hooks/visa/faqs/faqs";
import { updatePricelist } from "../../../../../hooks/visa/pricelist/updatePricelist";
import { updateProcess } from "../../../../../hooks/visa/process/updateProcess";
import { updatePayment } from "../../../../../hooks/visa/payment/updatePayment";
import { updateTerm } from "../../../../../hooks/visa/terms/updateTerm";
import { updateDocument } from "../../../../../hooks/visa/document/updateDocument";
import { updateFaq } from "../../../../../hooks/visa/faqs/faqs";
import { addPriceList } from "../../../../../hooks/visa/pricelist/addPriceList";
import { addProcess } from "../../../../../hooks/visa/process/addProcess";
import { addPayment } from "../../../../../hooks/visa/payment/addPayment";
import { addTerm } from "../../../../../hooks/visa/terms/addTerm";
import { addDocument } from "../../../../../hooks/visa/document/addDocument";
import { addFaq } from "../../../../../hooks/visa/faqs/faqs";
import { deletePricelist } from "../../../../../hooks/visa/pricelist/deletePriceList";
import { deleteProcess } from "../../../../../hooks/visa/process/deleteProcess";
import { deleteTerm } from "../../../../../hooks/visa/terms/deleteTerm";
import { deleteDocument } from "../../../../../hooks/visa/document/deleteDocument";
import { deletePayment } from "../../../../../hooks/visa/payment/deletePayment";
import { deleteFaq } from "../../../../../hooks/visa/faqs/faqs";
import { updateVisaFile } from "../../../../../hooks/visa/file/updateVisaFile";
import { addVisaFile } from "../../../../../hooks/visa/file/addVisaFile";
import { deleteVisaFile } from "../../../../../hooks/visa/file/deleteVisaFile";
import type { PricelistFormHandle } from "../../../../visa/EditPricelistForm";
import type { ProcessFormHandle } from "../../../../visa/EditProcessForm";
import type { PaymentFormHandle } from "../../../../visa/EditPaymentForm";
import type { DocumentFormHandle } from "../../../../visa/EditDocumentForm";
import type { FaqsFormHandle } from "../../../../visa/EditFaqsForm";
import FormTabs from "../../../../visa/information/add/FormTab";
import EditPricelistForm from "../../../../visa/EditPricelistForm";
import EditProcessForm from "../../../../visa/EditProcessForm";
import EditPaymentForm from "../../../../visa/EditPaymentForm";
import EditDocumentForm from "../../../../visa/EditDocumentForm";
import EditFaqsForm from "../../../../visa/EditFaqsForm";
import ActionButton from "../../../../button/ActionButton";
import Modal from "../../../../modal/Modal";
import PageLoader from "../../../../loader/PageLoader";
import EditTermForm, {
  type TermFormHandle,
} from "../../../../visa/EditTermForm";
import type { addFaqData } from "../../../../../types/faqs/addFaqsTypes";

export type FormType =
  | "pricelist"
  | "process"
  | "payment"
  | "term"
  | "document"
  | "faq";

interface EditData {
  pricelist?: any[];
  process?: any[];
  payment?: any[];
  term?: any[];
  document?: any[];
  faq?: any[];
}

interface FileData {
  pricelist: any[];
  process: any[];
  term: any[];
  document: any[];
}

interface FileFetchResult {
  type: "pricelist" | "process" | "term" | "document";
  data: any;
  index: number;
}

interface ErrorState {
  message: string;
  type: "error" | "success";
  action?: "addOrUpdate" | "delete";
}

const FORM_TYPES: FormType[] = [
  "pricelist",
  "process",
  "payment",
  "term",
  "document",
  "faq",
];

const useEditData = (id: string | undefined) => {
  const [editData, setEditData] = useState<EditData>({});
  const [fileData, setFileData] = useState<FileData>({
    pricelist: [],
    process: [],
    term: [],
    document: [],
  });
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
        console.error("No rail pass ID provided");
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
          faqData,
        ] = await Promise.all([
          getPassPricelist(id).catch(() => null),
          getPassProcess(id).catch(() => null),
          getPassPayment(id).catch(() => null),
          getPassTerm(id).catch(() => null),
          getPassDocument(id).catch(() => null),
          getPassFaq(id).catch(() => null),
        ]);

        const toArray = (data: any) => {
          if (!data) return [];
          return Array.isArray(data) ? data : [data].filter(Boolean);
        };

        // Map pricelist data to ensure currency is properly handled
        const mappedPricelistData = toArray(pricelistData).map((item: any) => ({
          ...item,
          priceCurrency: item.currency || item.priceCurrency || "USD",
        }));

        const processArray = toArray(processData);
        const termArray = toArray(termData);
        const documentArray = toArray(documentData);
        const paymentArray = toArray(paymentData);
        const faqArray = toArray(faqData);

        setEditData({
          pricelist: mappedPricelistData,
          process: processArray,
          payment: paymentArray,
          term: termArray,
          document: documentArray,
          faq: faqArray,
        });

        // Set file IDs
        const createFileIdsArray = (dataArray: any[]) =>
          dataArray.map((item) =>
            item?.filesAssociated
              ? Array.isArray(item.filesAssociated)
                ? item.filesAssociated
                : [item.filesAssociated]
              : [],
          );

        setPricelistFileIds(createFileIdsArray(mappedPricelistData));
        setProcessFileIds(createFileIdsArray(processArray));
        setTermFileIds(createFileIdsArray(termArray));
        setDocumentFileIds(createFileIdsArray(documentArray));

        // Fetch actual file data
        const fileFetchPromises: Promise<FileFetchResult>[] = [];

        const addFilePromises = (
          type: FileFetchResult["type"],
          dataArray: any[],
        ) => {
          dataArray.forEach((item, index) => {
            if (item?.filesAssociated) {
              const fileId = Array.isArray(item.filesAssociated)
                ? item.filesAssociated[0]
                : item.filesAssociated;
              fileFetchPromises.push(
                fetchVisaFile(fileId).then((file) => ({
                  type,
                  data: file,
                  index,
                })),
              );
            }
          });
        };

        addFilePromises("pricelist", mappedPricelistData);
        addFilePromises("process", processArray);
        addFilePromises("term", termArray);
        addFilePromises("document", documentArray);

        const fileResults = await Promise.all(fileFetchPromises);

        // Initialize file data arrays with the same length as edit data
        const organizedFileData: FileData = {
          pricelist: new Array(mappedPricelistData.length).fill(undefined),
          process: new Array(processArray.length).fill(undefined),
          term: new Array(termArray.length).fill(undefined),
          document: new Array(documentArray.length).fill(undefined),
        };

        // Organize file data by type and index
        fileResults.forEach((result) => {
          if (result?.data) {
            if (result.type === "pricelist") {
              organizedFileData.pricelist[result.index] = result.data;
            } else if (result.type === "process") {
              organizedFileData.process[result.index] = result.data;
            } else if (result.type === "term") {
              organizedFileData.term[result.index] = result.data;
            } else if (result.type === "document") {
              organizedFileData.document[result.index] = result.data;
            }
          }
        });

        setFileData(organizedFileData);
      } catch (error: any) {
        console.error("Error fetching edit data:", error);
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
    faq: useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        updateFaq(id, data),
    }),
  };

  const addMutations = {
    pricelist: useMutation({ mutationFn: addPriceList }),
    process: useMutation({ mutationFn: addProcess }),
    payment: useMutation({ mutationFn: addPayment }),
    term: useMutation({ mutationFn: addTerm }),
    document: useMutation({ mutationFn: addDocument }),
    faq: useMutation({ mutationFn: addFaq }),
  };

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

  const deleteFaqMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"], exact: false });
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
    deleteFaqMutation,
    fileMutation,
    fileAddMutation,
    fileDeleteMutation,
    invalidateQueries,
  };
};

const hasFormData = (formData: any): boolean => {
  if (formData === null || !formData) return false;

  if (Array.isArray(formData) && formData.length > 0) {
    return true;
  }

  if (
    "pricelistData" in formData &&
    Array.isArray(formData.pricelistData) &&
    formData.pricelistData.length > 0
  ) {
    return true;
  }
  if (
    "processData" in formData &&
    Array.isArray(formData.processData) &&
    formData.processData.length > 0
  ) {
    return true;
  }
  if (
    "paymentData" in formData &&
    Array.isArray(formData.paymentData) &&
    formData.paymentData.length > 0
  ) {
    return true;
  }
  if (
    "termData" in formData &&
    Array.isArray(formData.termData) &&
    formData.termData.length > 0
  ) {
    return true;
  }
  if (
    "documentData" in formData &&
    Array.isArray(formData.documentData) &&
    formData.documentData.length > 0
  ) {
    return true;
  }

  return false;
};

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formType, setFormType] = useState<FormType>("pricelist");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deletingPricelistId, setDeletingPricelistId] = useState<string | null>(
    null,
  );
  const [deletingProcessId, setDeletingProcessId] = useState<string | null>(
    null,
  );
  const [deletingTermId, setDeletingTermId] = useState<string | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(
    null,
  );
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);
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
    deleteFaqMutation,
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
  const faqFormRef = useRef<FaqsFormHandle>(null);

  const showMessage = useCallback((message: ErrorState | null) => {
    setMessage(message);
  }, []);

  const handleFile = useCallback(
    async (
      fileData: FileList | undefined,
      fileTitle: string | undefined,
      existingFileId?: string,
    ): Promise<string> => {
      if ((!fileData || fileData.length === 0) && !existingFileId) {
        return "";
      }

      if ((!fileData || fileData.length === 0) && existingFileId) {
        return existingFileId;
      }

      const formData = new FormData();
      formData.append("type", "file");

      const finalFileTitle =
        fileTitle?.trim() || (existingFileId ? "Updated File" : "New File");
      formData.append("fileTitle", finalFileTitle);

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
    [fileMutation, fileAddMutation, showMessage],
  );

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

        const formHandle = pricelistFormRef.current as any;
        if (formHandle.removePricelistField) {
          formHandle.removePricelistField(index);
        }

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
    ],
  );

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

        const formHandle = processFormRef.current as any;
        if (formHandle.removeProcessField) {
          formHandle.removeProcessField(index);
        }

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
    ],
  );

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

        const formHandle = termFormRef.current as any;
        if (formHandle.removeTermField) {
          formHandle.removeTermField(index);
        }

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
    [deleteTermMutation, setEditData, setFileData, setTermFileIds, showMessage],
  );

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

        const formHandle = documentFormRef.current as any;
        if (formHandle.removeDocumentField) {
          formHandle.removeDocumentField(index);
        }

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
    ],
  );

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

        const formHandle = paymentFormRef.current as any;
        if (formHandle.removePaymentField) {
          formHandle.removePaymentField(index);
        }

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
    [deletePaymentMutation, setEditData, showMessage],
  );

  const handleDeleteFaq = useCallback(
    async (faqId: string, index: number) => {
      if (
        !faqId ||
        !window.confirm("Are you sure you want to delete this FAQ?")
      ) {
        return;
      }

      try {
        setDeletingFaqId(faqId);
        await deleteFaqMutation.mutateAsync(faqId);

        const formHandle = faqFormRef.current as any;
        if (formHandle.removeFaqField) {
          formHandle.removeFaqField(index);
        }

        setEditData((prev) => ({
          ...prev,
          faq: prev.faq?.filter((_, i) => i !== index) || [],
        }));

        showMessage({
          message: "FAQ deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting FAQ:", error);
        showMessage({
          message: error.message || "Error deleting FAQ",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingFaqId(null);
      }
    },
    [deleteFaqMutation, setEditData, showMessage],
  );

  const handleDeleteFile = useCallback(
    async (fileId: string, fileType: FormType, index?: number) => {
      if (
        !fileId ||
        !window.confirm(
          `Are you sure you want to delete this ${fileType} file?`,
        )
      ) {
        return;
      }

      try {
        setDeletingFileId(fileId);
        await fileDeleteMutation.mutateAsync(fileId);

        const updateFileIds = (fileIds: string[][]) => {
          const newFileIds = [...fileIds];
          if (index !== undefined && newFileIds[index]) {
            newFileIds[index] = newFileIds[index].filter((id) => id !== fileId);
          }
          return newFileIds;
        };

        switch (fileType) {
          case "pricelist":
            setPricelistFileIds(updateFileIds(pricelistFileIds));
            break;
          case "process":
            setProcessFileIds(updateFileIds(processFileIds));
            break;
          case "term":
            setTermFileIds(updateFileIds(termFileIds));
            break;
          case "document":
            setDocumentFileIds(updateFileIds(documentFileIds));
            break;
        }

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
      pricelistFileIds,
      processFileIds,
      termFileIds,
      documentFileIds,
      showMessage,
    ],
  );

  const getMutationFunction = useCallback(
    (type: string, hasExistingData: boolean) => {
      const typeMapping: Record<string, keyof typeof updateMutations> = {
        price: "pricelist",
        process: "process",
        payment: "payment",
        terms: "term",
        document: "document",
        faq: "faq",
      };

      const mutationKey = typeMapping[type] || type;

      if (hasExistingData) {
        const mutation = updateMutations[mutationKey];
        if (!mutation) throw new Error(`Invalid update form type: ${type}`);
        return mutation;
      } else {
        const mutation = addMutations[mutationKey];
        if (!mutation) throw new Error(`Invalid add form type: ${type}`);
        return mutation;
      }
    },
    [updateMutations, addMutations],
  );

  const processFormSubmission = async (
    formData: any,
    formType: string,
    fileIds: string[][],
    setFileIds: React.Dispatch<React.SetStateAction<string[][]>>,
    editDataArray: any[],
  ) => {
    if (!formData) return [];

    const dataField = `${formType}Data`;
    const fileField = `${formType}FileData`;

    const data = formData[dataField];
    const fileData = formData[fileField];

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return [];
    }

    const safeFileData = Array.isArray(fileData)
      ? fileData
      : fileData
        ? [fileData]
        : [];
    const safeData = Array.isArray(data) ? data : data ? [data] : [];

    const fileUploadPromises: Promise<string>[] = safeData.map(async (_, i) => {
      const fileDataItem = safeFileData[i];
      const existingFileId = fileIds[i]?.[0] || "";

      if (fileDataItem?.file && fileDataItem.file.length > 0) {
        try {
          return await handleFile(
            fileDataItem.file,
            fileDataItem.fileTitle,
            existingFileId,
          );
        } catch (error) {
          console.error(`Error uploading file for ${formType}:`, error);
          return existingFileId;
        }
      }
      return existingFileId;
    });

    const uploadedFileIds = await Promise.all(fileUploadPromises);

    if (
      uploadedFileIds.some((id) => id !== fileIds.map((f) => f[0]).join(""))
    ) {
      setFileIds(uploadedFileIds.map((fileId) => [fileId]));
    }

    const submissions = [];
    const editArray = Array.isArray(editDataArray)
      ? editDataArray
      : editDataArray
        ? [editDataArray]
        : [];

    for (let i = 0; i < safeData.length; i++) {
      const item = safeData[i];
      if (!item) continue;

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("railpass", id!);

      if (formType === "pricelist") {
        formDataToSubmit.append("type", "price");
        formDataToSubmit.append("plan", item.plan || "");
        formDataToSubmit.append("fee", item.fee?.toString() || "");
        formDataToSubmit.append("description", item.description || "");
        formDataToSubmit.append("priceCurrency", item.priceCurrency || "USD");
      } else if (formType === "process") {
        formDataToSubmit.append("type", "process");
        formDataToSubmit.append("processTitle", item.processTitle || "");
        formDataToSubmit.append("process", item.process || "");
      } else if (formType === "term") {
        formDataToSubmit.append("type", "terms");
        formDataToSubmit.append("title", item.title || "");
        formDataToSubmit.append("terms", item.terms || "");
      } else if (formType === "document") {
        formDataToSubmit.append("type", "document");
        formDataToSubmit.append("docTitle", item.docTitle || "");
        formDataToSubmit.append("docDescription", item.docDescription || "");
      }

      if (uploadedFileIds[i]) {
        formDataToSubmit.append("filesAssociated", uploadedFileIds[i]);
      }

      const hasExistingData = !!editArray[i]?._id;
      const mutation = getMutationFunction(
        formType === "pricelist" ? "price" : formType,
        hasExistingData,
      );

      try {
        if (hasExistingData) {
          submissions.push(
            (mutation as any).mutateAsync({
              id: editArray[i]._id,
              data: formDataToSubmit,
            }),
          );
        } else {
          submissions.push((mutation as any).mutateAsync(formDataToSubmit));
        }
      } catch (error) {
        console.error(`Error creating submission for ${formType}:`, error);
      }
    }

    return submissions;
  };

  const processNonFileFormSubmission = async (
    formData: any,
    formType: string,
    editDataArray: any[],
  ) => {
    if (!formData || !hasFormData(formData)) return [];

    if (formType === "faq" && Array.isArray(formData)) {
      const submissions = [];
      const editArray = Array.isArray(editDataArray) ? editDataArray : [];

      for (let i = 0; i < formData.length; i++) {
        const item = formData[i] as addFaqData;

        if (!item?.question?.trim() || !item?.answer?.trim()) {
          throw new Error("Question and answer are required");
        }

        const faqData: any = {
          type: "faq",
          question: item.question,
          answer: item.answer,
          railpass: id,
        };

        if (item.formattedLinks && item.formattedLinks.length > 0) {
          faqData.formattedLinks = item.formattedLinks;
        }

        console.log("Submitting FAQ with data:", faqData);

        const hasExistingData = !!editArray[i]?._id;
        const mutation = getMutationFunction("faq", hasExistingData);

        if (hasExistingData) {
          submissions.push(
            (mutation as any).mutateAsync({
              id: editArray[i]._id,
              data: faqData,
            }),
          );
        } else {
          submissions.push((mutation as any).mutateAsync(faqData));
        }
      }

      return submissions;
    }

    const { [`${formType}Data`]: data } = formData;
    if (!data) return [];

    const safeData = Array.isArray(data) ? data : [data];
    const submissions = [];
    const editArray = Array.isArray(editDataArray)
      ? editDataArray
      : [editDataArray].filter(Boolean);

    for (let i = 0; i < safeData.length; i++) {
      const item = safeData[i];
      if (!item) continue;

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("type", formType);
      formDataToSubmit.append("railpass", id!);

      if (formType === "payment") {
        formDataToSubmit.append("paymentType", item.paymentType || "");
        formDataToSubmit.append("currency", item.currency || "");
        formDataToSubmit.append("accountName", item.accountName || "");
        formDataToSubmit.append("bankName", item.bankName || "");
        formDataToSubmit.append("accountNo", item.accountNo || "");
        formDataToSubmit.append("bankAddress", item.bankAddress || "");
        formDataToSubmit.append("swiftCode", item.swiftCode || "");
      }

      const hasExistingData = !!editArray[i]?._id;
      const mutation = getMutationFunction(formType, hasExistingData);

      if (hasExistingData) {
        submissions.push(
          (mutation as any).mutateAsync({
            id: editArray[i]._id,
            data: formDataToSubmit,
          }),
        );
      } else {
        submissions.push((mutation as any).mutateAsync(formDataToSubmit));
      }
    }

    return submissions;
  };

  const handleFinalSubmit = async () => {
    if (!id) {
      showMessage({
        message: "No rail pass ID found. Please select a rail pass first.",
        type: "error",
        action: "addOrUpdate",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const [
        pricelistFormData,
        processFormData,
        paymentFormData,
        termFormData,
        documentFormData,
        faqFormData,
      ] = await Promise.all([
        pricelistFormRef.current?.getFormData(),
        processFormRef.current?.getFormData(),
        paymentFormRef.current?.getFormData(),
        termFormRef.current?.getFormData(),
        documentFormRef.current?.getFormData(),
        faqFormRef.current?.getFormData(),
      ]);

      const formResults = [
        { data: pricelistFormData, type: "pricelist" },
        { data: processFormData, type: "process" },
        { data: paymentFormData, type: "payment" },
        { data: termFormData, type: "term" },
        { data: documentFormData, type: "document" },
        { data: faqFormData, type: "faq" },
      ];

      const validationErrors = formResults.filter(({ data }) => data === null);

      if (validationErrors.length > 0) {
        showMessage({
          message:
            "Please complete all required fields in the forms before submitting.",
          type: "error",
          action: "addOrUpdate",
        });
        setIsSubmitting(false);
        return;
      }

      const hasAtLeastOneValidForm = formResults.some(({ data }) =>
        hasFormData(data),
      );

      if (!hasAtLeastOneValidForm) {
        showMessage({
          message:
            "Please fill at least one form completely before submitting.",
          type: "error",
          action: "addOrUpdate",
        });
        setIsSubmitting(false);
        return;
      }

      const allSubmissions = await Promise.all([
        processFormSubmission(
          pricelistFormData,
          "pricelist",
          pricelistFileIds,
          setPricelistFileIds,
          editData.pricelist || [],
        ),
        processFormSubmission(
          processFormData,
          "process",
          processFileIds,
          setProcessFileIds,
          editData.process || [],
        ),
        processNonFileFormSubmission(
          paymentFormData,
          "payment",
          editData.payment || [],
        ),
        processFormSubmission(
          termFormData,
          "term",
          termFileIds,
          setTermFileIds,
          editData.term || [],
        ),
        processFormSubmission(
          documentFormData,
          "document",
          documentFileIds,
          setDocumentFileIds,
          editData.document || [],
        ),
        processNonFileFormSubmission(faqFormData, "faq", editData.faq || []),
      ]);

      const flattenedSubmissions = allSubmissions.flat();

      if (flattenedSubmissions.length > 0) {
        await Promise.all(flattenedSubmissions);
      }

      invalidateQueries();

      showMessage({
        message: "Rail pass information updated successfully!",
        type: "success",
        action: "addOrUpdate",
      });

      navigate(-2);
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
  };

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
    faq: {
      ref: faqFormRef,
      editData: editData.faq || [],
      onDeleteFaq: handleDeleteFaq,
      isDeletingFaq: deletingFaqId !== null,
    },
  };

  return (
    <>
      <div className="w-full min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100">
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
            {type === "document" && (
              <EditDocumentForm {...formProps.document} />
            )}
            {type === "faq" && <EditFaqsForm {...formProps.faq} />}
          </div>
        ))}

        <div className="w-full lg:w-2xl">
          <ActionButton
            action={handleFinalSubmit}
            isLoading={isLoading}
            title="Save Rail Pass Information"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white text-sm duration-300 w-full"
          />
        </div>
      </div>
      {message && (
        <Modal
          message={message.message}
          success={message.type === "success"}
          action={() => {
            showMessage(null);
          }}
        />
      )}
    </>
  );
};

export default Edit;
