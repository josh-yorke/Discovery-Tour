import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "../../../modal/Modal";
import { deletePricelist } from "../../../../hooks/visa/pricelist/deletePriceList";
import { deleteProcess } from "../../../../hooks/visa/process/deleteProcess";
import { addPriceList } from "../../../../hooks/visa/pricelist/addPriceList";
import { addProcess } from "../../../../hooks/visa/process/addProcess";
import { addPayment } from "../../../../hooks/visa/payment/addPayment";
import { addTerm } from "../../../../hooks/visa/terms/addTerm";
import { addDocument } from "../../../../hooks/visa/document/addDocument";
import type { DocumentFormHandle } from "../../../visa/EditDocumentForm";
import type { TermFormHandle } from "../../../visa/EditTermForm";
import type { PaymentFormHandle } from "../../../visa/EditPaymentForm";
import type { ProcessFormHandle } from "../../../visa/EditProcessForm";
import type { PricelistFormHandle } from "../../../visa/EditPricelistForm";
import { deleteVisaFile } from "../../../../hooks/visa/file/deleteVisaFile";
import { addVisaFile } from "../../../../hooks/visa/file/addVisaFile";
import { updateVisaFile } from "../../../../hooks/visa/file/updateVisaFile";
import { deletePayment } from "../../../../hooks/visa/payment/deletePayment";
import { deleteDocument } from "../../../../hooks/visa/document/deleteDocument";
import { deleteTerm } from "../../../../hooks/visa/terms/deleteTerm";
import PageLoader from "../../../loader/PageLoader";
import ActionButton from "../../../button/ActionButton";
import EditDocumentForm from "../../../visa/EditDocumentForm";
import EditTermForm from "../../../visa/EditTermForm";
import EditPaymentForm from "../../../visa/EditPaymentForm";
import EditProcessForm from "../../../visa/EditProcessForm";
import EditPricelistForm from "../../../visa/EditPricelistForm";
import FormTabs from "../../../visa/information/add/FormTab";
import { updatePayment } from "../../../../hooks/visa/payment/updatePayment";
import { updateTerm } from "../../../../hooks/visa/terms/updateTerm";
import { updateDocument } from "../../../../hooks/visa/document/updateDocument";
import { updateProcess } from "../../../../hooks/visa/process/updateProcess";
import { updatePricelist } from "../../../../hooks/visa/pricelist/updatePricelist";
import { getVisaFile } from "../../../../hooks/visa/file/getVisaFile";
import { getInsurancePricelist } from "../../../../hooks/visa/pricelist/getPriceList";
import { getInsuranceProcess } from "../../../../hooks/visa/process/getProcess";
import { getInsurancePayment } from "../../../../hooks/visa/payment/getPayment";
import { getInsuranceTerm } from "../../../../hooks/visa/terms/getTerm";
import { getInsuranceDocument } from "../../../../hooks/visa/document/getDocument";

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
];

const useEditData = (id: string | undefined) => {
  const [editData, setEditData] = useState<EditData>({});
  const [fileData, setFileData] = useState<FileData>({});
  const [pricelistFileIds, setPricelistFileIds] = useState<string[][]>([]);
  const [processFileIds, setProcessFileIds] = useState<string[][]>([]);
  const [termFileIds, setTermFileIds] = useState<string[][]>([]);
  const [documentFileIds, setDocumentFileIds] = useState<string[][]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchInsuranceFile = useCallback(
    async (fileId: string): Promise<any> => {
      if (!fileId) return null;
      try {
        return await getVisaFile(fileId);
      } catch (error) {
        console.error(`Error fetching file with ID ${fileId}:`, error);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!id) {
        console.error("No insurance ID provided");
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
          getInsurancePricelist(id),
          getInsuranceProcess(id),
          getInsurancePayment(id),
          getInsuranceTerm(id),
          getInsuranceDocument(id),
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

        const pricelistFileIdsArray = pricelistArray.map((pricelist) =>
          pricelist?.filesAssociated
            ? Array.isArray(pricelist.filesAssociated)
              ? pricelist.filesAssociated
              : [pricelist.filesAssociated]
            : [],
        );
        setPricelistFileIds(pricelistFileIdsArray);

        const processFileIdsArray = processArray.map((processItem) =>
          processItem?.filesAssociated
            ? Array.isArray(processItem.filesAssociated)
              ? processItem.filesAssociated
              : [processItem.filesAssociated]
            : [],
        );
        setProcessFileIds(processFileIdsArray);

        const termFileIdsArray = termArray.map((termItem) =>
          termItem?.filesAssociated
            ? Array.isArray(termItem.filesAssociated)
              ? termItem.filesAssociated
              : [termItem.filesAssociated]
            : [],
        );
        setTermFileIds(termFileIdsArray);

        const documentFileIdsArray = documentArray.map((documentItem) =>
          documentItem?.filesAssociated
            ? Array.isArray(documentItem.filesAssociated)
              ? documentItem.filesAssociated
              : [documentItem.filesAssociated]
            : [],
        );
        setDocumentFileIds(documentFileIdsArray);

        const fileFetchPromises: Promise<FileFetchResult>[] = [];

        pricelistArray.forEach((pricelist, index) => {
          if (pricelist?.filesAssociated) {
            const fileId = Array.isArray(pricelist.filesAssociated)
              ? pricelist.filesAssociated[0]
              : pricelist.filesAssociated;
            fileFetchPromises.push(
              fetchInsuranceFile(fileId).then((file) => ({
                type: "pricelist" as const,
                data: file,
                index,
              })),
            );
          }
        });

        processArray.forEach((processItem, index) => {
          if (processItem?.filesAssociated) {
            const fileId = Array.isArray(processItem.filesAssociated)
              ? processItem.filesAssociated[0]
              : processItem.filesAssociated;
            fileFetchPromises.push(
              fetchInsuranceFile(fileId).then((file) => ({
                type: "process" as const,
                data: file,
                index,
              })),
            );
          }
        });

        termArray.forEach((termItem, index) => {
          if (termItem?.filesAssociated) {
            const fileId = Array.isArray(termItem.filesAssociated)
              ? termItem.filesAssociated[0]
              : termItem.filesAssociated;
            fileFetchPromises.push(
              fetchInsuranceFile(fileId).then((file) => ({
                type: "term" as const,
                data: file,
                index,
              })),
            );
          }
        });

        documentArray.forEach((documentItem, index) => {
          if (documentItem?.filesAssociated) {
            const fileId = Array.isArray(documentItem.filesAssociated)
              ? documentItem.filesAssociated[0]
              : documentItem.filesAssociated;
            fileFetchPromises.push(
              fetchInsuranceFile(fileId).then((file) => ({
                type: "document" as const,
                data: file,
                index,
              })),
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
        throw error;
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchExistingData();
  }, [id, fetchInsuranceFile]);

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
  };

  const addMutations = {
    pricelist: useMutation({ mutationFn: addPriceList }),
    process: useMutation({ mutationFn: addProcess }),
    payment: useMutation({ mutationFn: addPayment }),
    term: useMutation({ mutationFn: addTerm }),
    document: useMutation({ mutationFn: addDocument }),
  };

  const deletePricelistMutation = useMutation({
    mutationFn: deletePricelist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["insurance-pricelist"],
        exact: false,
      });
    },
  });

  const deleteProcessMutation = useMutation({
    mutationFn: deleteProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["insurance-process"],
        exact: false,
      });
    },
  });

  const deleteTermMutation = useMutation({
    mutationFn: deleteTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["insurance-term"],
        exact: false,
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["insurance-document"],
        exact: false,
      });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["insurance-payment"],
        exact: false,
      });
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
      queryClient.invalidateQueries({
        queryKey: ["insurance-files"],
        exact: false,
      });
    },
  });

  const invalidateQueries = useCallback(() => {
    FORM_TYPES.forEach((type) => {
      queryClient.invalidateQueries({
        queryKey: [`insurance-${type}`],
        exact: false,
      });
    });
    queryClient.invalidateQueries({
      queryKey: ["insurance-files"],
      exact: false,
    });
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

const hasFormData = (formData: any): boolean => {
  if (formData === null) {
    return false;
  }

  if (!formData) return false;

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

        const updateState = {
          pricelist: () => {
            if (index !== undefined) {
              setPricelistFileIds((prev) => {
                const newFileIds = [...prev];
                if (newFileIds[index]) {
                  newFileIds[index] = newFileIds[index].filter(
                    (id) => id !== fileId,
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
                              (id: any) => id !== fileId,
                            ) || [],
                        }
                      : pricelist,
                  ) || [],
              }));

              setFileData((prev) => ({
                ...prev,
                pricelist:
                  prev.pricelist?.map((file, i) =>
                    i === index ? undefined : file,
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
                    (id) => id !== fileId,
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
                              (id: any) => id !== fileId,
                            ) || [],
                        }
                      : processItem,
                  ) || [],
              }));

              setFileData((prev) => ({
                ...prev,
                process:
                  prev.process?.map((file, i) =>
                    i === index ? undefined : file,
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
                    (id) => id !== fileId,
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
                              (id: any) => id !== fileId,
                            ) || [],
                        }
                      : termItem,
                  ) || [],
              }));

              setFileData((prev) => ({
                ...prev,
                term:
                  prev.term?.map((file, i) =>
                    i === index ? undefined : file,
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
                    (id) => id !== fileId,
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
                              (id: any) => id !== fileId,
                            ) || [],
                        }
                      : documentItem,
                  ) || [],
              }));

              setFileData((prev) => ({
                ...prev,
                document:
                  prev.document?.map((file, i) =>
                    i === index ? undefined : file,
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
    [updateMutations, addMutations],
  );

  const handleFinalSubmit = async () => {
    if (!id) {
      showMessage({
        message:
          "No insurance ID found. Please select an insurance policy first.",
        type: "error",
        action: "addOrUpdate",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const pricelistFormData = await pricelistFormRef.current?.getFormData();
      const processFormData = await processFormRef.current?.getFormData();
      const paymentFormData = await paymentFormRef.current?.getFormData();
      const termFormData = await termFormRef.current?.getFormData();
      const documentFormData = await documentFormRef.current?.getFormData();

      // FIRST: Check if any form has validation errors (returns null)
      const formResults = [
        { data: pricelistFormData, type: "pricelist" },
        { data: processFormData, type: "process" },
        { data: paymentFormData, type: "payment" },
        { data: termFormData, type: "term" },
        { data: documentFormData, type: "document" },
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

      // SECOND: Check if at least one form has valid data
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

      const submissions: any[] = [];

      if (pricelistFormData && hasFormData(pricelistFormData)) {
        const { pricelistData, pricelistFileData } = pricelistFormData;

        const pricelistFileUploadPromises: Promise<string>[] = [];
        const safePricelistFileData = Array.isArray(pricelistFileData)
          ? pricelistFileData
          : [pricelistFileData];

        for (let i = 0; i < safePricelistFileData.length; i++) {
          const fileData = safePricelistFileData[i];
          const existingFileId = pricelistFileIds[i]?.[0] || "";

          if (fileData?.file && fileData.file.length > 0) {
            pricelistFileUploadPromises.push(
              handleFile(fileData.file, fileData.fileTitle, existingFileId),
            );
          } else {
            pricelistFileUploadPromises.push(Promise.resolve(existingFileId));
          }
        }

        const pricelistFileUploadIds = await Promise.all(
          pricelistFileUploadPromises,
        );
        setPricelistFileIds(pricelistFileUploadIds.map((fileId) => [fileId]));

        const safePricelistData = Array.isArray(pricelistData)
          ? pricelistData
          : [pricelistData];

        const editPricelistArray = Array.isArray(editData.pricelist)
          ? editData.pricelist
          : [editData.pricelist].filter(Boolean);

        for (let i = 0; i < safePricelistData.length; i++) {
          const pricelistItem = safePricelistData[i];
          const pricelistFormDataToSubmit = new FormData();
          pricelistFormDataToSubmit.append("type", "price");
          pricelistFormDataToSubmit.append("plan", pricelistItem.plan || "");

          if (pricelistItem.fee !== undefined && pricelistItem.fee !== null) {
            pricelistFormDataToSubmit.append(
              "fee",
              pricelistItem.fee.toString(),
            );
          }

          pricelistFormDataToSubmit.append(
            "description",
            pricelistItem.description || "",
          );

          pricelistFormDataToSubmit.append(
            "priceCurrency",
            pricelistItem.priceCurrency || "USD",
          );

          pricelistFormDataToSubmit.append("insurance", id);

          if (pricelistFileUploadIds[i]) {
            pricelistFormDataToSubmit.append(
              "filesAssociated",
              pricelistFileUploadIds[i],
            );
          }

          const hasExistingData = !!editPricelistArray[i]?._id;
          const mutation = getMutationFunction("price", hasExistingData);

          if (hasExistingData) {
            submissions.push(
              (mutation as any).mutateAsync({
                id: editPricelistArray[i]._id,
                data: pricelistFormDataToSubmit,
              }),
            );
          } else {
            submissions.push(
              (mutation as any).mutateAsync(pricelistFormDataToSubmit),
            );
          }
        }
      }

      if (processFormData && hasFormData(processFormData)) {
        const { processData, processFileData } = processFormData;

        const processFileUploadPromises: Promise<string>[] = [];
        const safeProcessFileData = Array.isArray(processFileData)
          ? processFileData
          : [processFileData];

        for (let i = 0; i < safeProcessFileData.length; i++) {
          const fileData = safeProcessFileData[i];
          const existingFileId = processFileIds[i]?.[0] || "";

          if (fileData?.file && fileData.file.length > 0) {
            processFileUploadPromises.push(
              handleFile(fileData.file, fileData.fileTitle, existingFileId),
            );
          } else {
            processFileUploadPromises.push(Promise.resolve(existingFileId));
          }
        }

        const processFileUploadIds = await Promise.all(
          processFileUploadPromises,
        );
        setProcessFileIds(processFileUploadIds.map((fileId) => [fileId]));

        const safeProcessData = Array.isArray(processData)
          ? processData
          : [processData];

        const editProcessArray = Array.isArray(editData.process)
          ? editData.process
          : [editData.process].filter(Boolean);

        for (let i = 0; i < safeProcessData.length; i++) {
          const processItem = safeProcessData[i];
          const processFormDataToSubmit = new FormData();
          processFormDataToSubmit.append("type", "process");
          processFormDataToSubmit.append(
            "processTitle",
            processItem.processTitle || "",
          );
          processFormDataToSubmit.append("process", processItem.process || "");
          processFormDataToSubmit.append("insurance", id);

          if (processFileUploadIds[i]) {
            processFormDataToSubmit.append(
              "filesAssociated",
              processFileUploadIds[i],
            );
          }

          const hasExistingData = !!editProcessArray[i]?._id;
          const mutation = getMutationFunction("process", hasExistingData);

          if (hasExistingData) {
            submissions.push(
              (mutation as any).mutateAsync({
                id: editProcessArray[i]._id,
                data: processFormDataToSubmit,
              }),
            );
          } else {
            submissions.push(
              (mutation as any).mutateAsync(processFormDataToSubmit),
            );
          }
        }
      }

      if (paymentFormData && hasFormData(paymentFormData)) {
        const { paymentData } = paymentFormData;

        const safePaymentData = Array.isArray(paymentData)
          ? paymentData
          : [paymentData];

        const editPaymentArray = Array.isArray(editData.payment)
          ? editData.payment
          : [editData.payment].filter(Boolean);

        for (let i = 0; i < safePaymentData.length; i++) {
          const paymentItem = safePaymentData[i];
          const paymentFormDataToSubmit = new FormData();
          paymentFormDataToSubmit.append("type", "payment");
          paymentFormDataToSubmit.append(
            "paymentType",
            paymentItem.paymentType || "",
          );
          paymentFormDataToSubmit.append(
            "currency",
            paymentItem.currency || "",
          );
          paymentFormDataToSubmit.append(
            "accountName",
            paymentItem.accountName || "",
          );
          paymentFormDataToSubmit.append(
            "bankName",
            paymentItem.bankName || "",
          );
          paymentFormDataToSubmit.append(
            "accountNo",
            paymentItem.accountNo || "",
          );
          paymentFormDataToSubmit.append(
            "bankAddress",
            paymentItem.bankAddress || "",
          );
          paymentFormDataToSubmit.append(
            "swiftCode",
            paymentItem.swiftCode || "",
          );
          paymentFormDataToSubmit.append("insurance", id);

          const hasExistingData = !!editPaymentArray[i]?._id;
          const mutation = getMutationFunction("payment", hasExistingData);

          if (hasExistingData) {
            submissions.push(
              (mutation as any).mutateAsync({
                id: editPaymentArray[i]._id,
                data: paymentFormDataToSubmit,
              }),
            );
          } else {
            submissions.push(
              (mutation as any).mutateAsync(paymentFormDataToSubmit),
            );
          }
        }
      }

      if (termFormData && hasFormData(termFormData)) {
        const { termData, termFileData } = termFormData;

        const termFileUploadPromises: Promise<string>[] = [];
        const safeTermFileData = Array.isArray(termFileData)
          ? termFileData
          : [termFileData];

        for (let i = 0; i < safeTermFileData.length; i++) {
          const fileData = safeTermFileData[i];
          const existingFileId = termFileIds[i]?.[0] || "";

          if (fileData?.file && fileData.file.length > 0) {
            termFileUploadPromises.push(
              handleFile(fileData.file, fileData.fileTitle, existingFileId),
            );
          } else {
            termFileUploadPromises.push(Promise.resolve(existingFileId));
          }
        }

        const termFileUploadIds = await Promise.all(termFileUploadPromises);
        setTermFileIds(termFileUploadIds.map((fileId) => [fileId]));

        const safeTermData = Array.isArray(termData) ? termData : [termData];

        const editTermArray = Array.isArray(editData.term)
          ? editData.term
          : [editData.term].filter(Boolean);

        for (let i = 0; i < safeTermData.length; i++) {
          const termItem = safeTermData[i];
          const termFormDataToSubmit = new FormData();
          termFormDataToSubmit.append("type", "terms");
          termFormDataToSubmit.append("title", termItem.title || "");
          termFormDataToSubmit.append("terms", termItem.terms || "");
          termFormDataToSubmit.append("insurance", id);

          if (termFileUploadIds[i]) {
            termFormDataToSubmit.append(
              "filesAssociated",
              termFileUploadIds[i],
            );
          }

          const hasExistingData = !!editTermArray[i]?._id;
          const mutation = getMutationFunction("terms", hasExistingData);

          if (hasExistingData) {
            submissions.push(
              (mutation as any).mutateAsync({
                id: editTermArray[i]._id,
                data: termFormDataToSubmit,
              }),
            );
          } else {
            submissions.push(
              (mutation as any).mutateAsync(termFormDataToSubmit),
            );
          }
        }
      }

      if (documentFormData && hasFormData(documentFormData)) {
        const { documentData, documentFileData } = documentFormData;

        const documentFileUploadPromises: Promise<string>[] = [];
        const safeDocumentFileData = Array.isArray(documentFileData)
          ? documentFileData
          : [documentFileData];

        for (let i = 0; i < safeDocumentFileData.length; i++) {
          const fileData = safeDocumentFileData[i];
          const existingFileId = documentFileIds[i]?.[0] || "";

          if (fileData?.file && fileData.file.length > 0) {
            documentFileUploadPromises.push(
              handleFile(fileData.file, fileData.fileTitle, existingFileId),
            );
          } else {
            documentFileUploadPromises.push(Promise.resolve(existingFileId));
          }
        }

        const documentFileUploadIds = await Promise.all(
          documentFileUploadPromises,
        );
        setDocumentFileIds(documentFileUploadIds.map((fileId) => [fileId]));

        const safeDocumentData = Array.isArray(documentData)
          ? documentData
          : [documentData];

        const editDocumentArray = Array.isArray(editData.document)
          ? editData.document
          : [editData.document].filter(Boolean);

        for (let i = 0; i < safeDocumentData.length; i++) {
          const documentItem = safeDocumentData[i];
          const documentFormDataToSubmit = new FormData();
          documentFormDataToSubmit.append("type", "document");
          documentFormDataToSubmit.append(
            "docTitle",
            documentItem.docTitle || "",
          );
          documentFormDataToSubmit.append(
            "docDescription",
            documentItem.docDescription || "",
          );
          documentFormDataToSubmit.append("insurance", id);

          if (documentFileUploadIds[i]) {
            documentFormDataToSubmit.append(
              "filesAssociated",
              documentFileUploadIds[i],
            );
          }

          const hasExistingData = !!editDocumentArray[i]?._id;
          const mutation = getMutationFunction("document", hasExistingData);

          if (hasExistingData) {
            submissions.push(
              (mutation as any).mutateAsync({
                id: editDocumentArray[i]._id,
                data: documentFormDataToSubmit,
              }),
            );
          } else {
            submissions.push(
              (mutation as any).mutateAsync(documentFormDataToSubmit),
            );
          }
        }
      }

      await Promise.all(submissions);
      invalidateQueries();

      showMessage({
        message: "Insurance information updated successfully!",
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
          </div>
        ))}

        <div className="w-full lg:w-2xl">
          <ActionButton
            action={handleFinalSubmit}
            isLoading={isLoading}
            title="Save Insurance Information"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white text-sm duration-300 w-full"
          />
        </div>
      </div>
      {message && (
        <Modal
          message={message.message}
          success={message.type === "success"}
          action={() => {
            setMessage(null);
            if (
              message.type === "success" &&
              message.action === "addOrUpdate"
            ) {
              navigate(-2);
            }
          }}
        />
      )}
    </>
  );
};

export default Edit;
