import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { getVisaFile } from "../../../../hooks/visa/file/getVisaFile";
import {
  addAccomodation,
  deleteAccommodation,
  getAccommodation,
  updateAccommodation,
} from "../../../../hooks/tours/accomodation/accomodation";
import {
  addCity,
  deleteCity,
  getCity,
  updateCity,
} from "../../../../hooks/tours/city/city";
import {
  addScope,
  deleteScope,
  getScope,
  updateScope,
} from "../../../../hooks/tours/scope/scope";
import {
  addItinerary,
  deleteItinerary,
  getItinerary,
  updateItinerary,
  type AddItineraryPayload,
} from "../../../../hooks/tours/itinerary/itinerary";
import { getTourPricelist } from "../../../../hooks/visa/pricelist/getPriceList";
import { getTourProcess } from "../../../../hooks/visa/process/getProcess";
import { getTourPayment } from "../../../../hooks/visa/payment/getPayment";
import { getTourTerm } from "../../../../hooks/visa/terms/getTerm";
import { getTourDocument } from "../../../../hooks/visa/document/getDocument";
import { updatePricelist } from "../../../../hooks/visa/pricelist/updatePricelist";
import { updateProcess } from "../../../../hooks/visa/process/updateProcess";
import { updatePayment } from "../../../../hooks/visa/payment/updatePayment";
import { updateTerm } from "../../../../hooks/visa/terms/updateTerm";
import { updateDocument } from "../../../../hooks/visa/document/updateDocument";
import { addPriceList } from "../../../../hooks/visa/pricelist/addPriceList";
import { addProcess } from "../../../../hooks/visa/process/addProcess";
import { addPayment } from "../../../../hooks/visa/payment/addPayment";
import { addTerm } from "../../../../hooks/visa/terms/addTerm";
import { addDocument } from "../../../../hooks/visa/document/addDocument";
import { deleteVisaFile } from "../../../../hooks/visa/file/deleteVisaFile";
import { addVisaFile } from "../../../../hooks/visa/file/addVisaFile";
import { updateVisaFile } from "../../../../hooks/visa/file/updateVisaFile";
import { deleteDocument } from "../../../../hooks/visa/document/deleteDocument";
import { deleteTerm } from "../../../../hooks/visa/terms/deleteTerm";
import { deletePayment } from "../../../../hooks/visa/payment/deletePayment";
import { deleteProcess } from "../../../../hooks/visa/process/deleteProcess";
import { deletePricelist } from "../../../../hooks/visa/pricelist/deletePriceList";
import type { AccommodationFormHandle } from "../editforms/EditAccommodationForm";
import type { PricelistFormHandle } from "../../../visa/EditPricelistForm";
import type { ProcessFormHandle } from "../../../visa/EditProcessForm";
import type { PaymentFormHandle } from "../../../visa/EditPaymentForm";
import type { TermFormHandle } from "../../../visa/EditTermForm";
import type { DocumentFormHandle } from "../../../visa/EditDocumentForm";
import PageLoader from "../../../loader/PageLoader";
import EditAccommodationForm from "../editforms/EditAccommodationForm";
import EditItineraryForm, {
  type ItineraryFormHandle,
} from "../editforms/EditItineraryForm";
import ActionButton from "../../../button/ActionButton";
import EditDocumentForm from "../../../visa/EditDocumentForm";
import EditTermForm from "../../../visa/EditTermForm";
import EditPaymentForm from "../../../visa/EditPaymentForm";
import EditProcessForm from "../../../visa/EditProcessForm";
import EditPricelistForm from "../../../visa/EditPricelistForm";
import FormTabs from "../../FormTab";
import type { CityFormHandle } from "../editforms/EditCityForm";
import EditCityForm from "../editforms/EditCityForm";
import EditScopeForm, {
  type ScopeFormHandle,
} from "../editforms/EditScopeForm";
import Modal from "../../../modal/Modal";

export type FormType =
  | "accommodation"
  | "city"
  | "scope"
  | "itinerary"
  | "pricelist"
  | "process"
  | "payment"
  | "term"
  | "document";

interface EditData {
  accommodation?: any[];
  city?: any[];
  scope?: any[];
  itinerary?: any[];
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
  "accommodation",
  "city",
  "scope",
  "itinerary",
  "pricelist",
  "process",
  "payment",
  "term",
  "document",
];

const useEditData = (tourId: string | undefined) => {
  const [editData, setEditData] = useState<EditData>({});
  const [fileData, setFileData] = useState<FileData>({});
  const [pricelistFileIds, setPricelistFileIds] = useState<string[][]>([]);
  const [processFileIds, setProcessFileIds] = useState<string[][]>([]);
  const [termFileIds, setTermFileIds] = useState<string[][]>([]);
  const [documentFileIds, setDocumentFileIds] = useState<string[][]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchTourFile = useCallback(async (fileId: string): Promise<any> => {
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
      if (!tourId) {
        console.error("No tour ID provided");
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);

        const [
          accommodationData,
          cityData,
          scopeData,
          itineraryData,
          pricelistData,
          processData,
          paymentData,
          termData,
          documentData,
        ] = await Promise.all([
          getAccommodation(tourId),
          getCity(tourId),
          getScope(tourId),
          getItinerary(tourId),
          getTourPricelist(tourId),
          getTourProcess(tourId),
          getTourPayment(tourId),
          getTourTerm(tourId),
          getTourDocument(tourId),
        ]);

        const toArray = (data: any) =>
          Array.isArray(data) ? data : [data].filter(Boolean);

        const accommodationArray = toArray(accommodationData);
        const cityArray = toArray(cityData);
        const scopeArray = toArray(scopeData);
        const itineraryArray = toArray(itineraryData);
        const pricelistArray = toArray(pricelistData);
        const processArray = toArray(processData);
        const paymentArray = toArray(paymentData);
        const termArray = toArray(termData);
        const documentArray = toArray(documentData);

        setEditData({
          accommodation: accommodationArray,
          city: cityArray,
          scope: scopeArray,
          itinerary: itineraryArray,
          pricelist: pricelistArray,
          process: processArray,
          payment: paymentArray,
          term: termArray,
          document: documentArray,
        });

        const createFileIdsArray = (dataArray: any[]) =>
          dataArray.map((item) =>
            item?.filesAssociated
              ? Array.isArray(item.filesAssociated)
                ? item.filesAssociated
                : [item.filesAssociated]
              : [],
          );

        setPricelistFileIds(createFileIdsArray(pricelistArray));
        setProcessFileIds(createFileIdsArray(processArray));
        setTermFileIds(createFileIdsArray(termArray));
        setDocumentFileIds(createFileIdsArray(documentArray));

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
                fetchTourFile(fileId).then((file) => ({
                  type,
                  data: file,
                  index,
                })),
              );
            }
          });
        };

        addFilePromises("pricelist", pricelistArray);
        addFilePromises("process", processArray);
        addFilePromises("term", termArray);
        addFilePromises("document", documentArray);

        const fileResults = await Promise.all(fileFetchPromises);
        const organizedFileData: FileData = {
          pricelist: [],
          process: [],
          term: [],
          document: [],
        };

        fileResults.forEach((result) => {
          const targetArray = organizedFileData[result.type];
          if (targetArray) {
            targetArray[result.index] = result.data;
          }
        });

        setFileData(organizedFileData);
      } catch (error) {
        console.error("Error fetching edit data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchExistingData();
  }, [tourId, fetchTourFile]);

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
    accommodation: useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateAccommodation(id, data),
    }),
    city: useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateCity(id, data),
    }),
    scope: useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateScope(id, data),
    }),
    itinerary: useMutation({
      mutationFn: ({ id, data }: { id: string; data: AddItineraryPayload }) =>
        updateItinerary(id, data),
    }),
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
    accommodation: useMutation({ mutationFn: addAccomodation }),
    city: useMutation({ mutationFn: addCity }),
    scope: useMutation({ mutationFn: addScope }),
    itinerary: useMutation({ mutationFn: addItinerary }),
    pricelist: useMutation({ mutationFn: addPriceList }),
    process: useMutation({ mutationFn: addProcess }),
    payment: useMutation({ mutationFn: addPayment }),
    term: useMutation({ mutationFn: addTerm }),
    document: useMutation({ mutationFn: addDocument }),
  };

  const deleteMutations = {
    accommodation: useMutation({
      mutationFn: deleteAccommodation,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["accommodations"] }),
    }),
    city: useMutation({
      mutationFn: deleteCity,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cities"] }),
    }),
    scope: useMutation({
      mutationFn: deleteScope,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scopes"] }),
    }),
    itinerary: useMutation({
      mutationFn: deleteItinerary,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["itineraries"] }),
    }),
    pricelist: useMutation({
      mutationFn: deletePricelist,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["pricelist"] }),
    }),
    process: useMutation({
      mutationFn: deleteProcess,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["process"] }),
    }),
    payment: useMutation({
      mutationFn: deletePayment,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payment"] }),
    }),
    term: useMutation({
      mutationFn: deleteTerm,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["term"] }),
    }),
    document: useMutation({
      mutationFn: deleteDocument,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["document"] }),
    }),
  };

  const fileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateVisaFile(id, data),
  });

  const fileAddMutation = useMutation({ mutationFn: addVisaFile });

  const fileDeleteMutation = useMutation({
    mutationFn: deleteVisaFile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
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
    deleteMutations,
    fileMutation,
    fileAddMutation,
    fileDeleteMutation,
    invalidateQueries,
  };
};

const hasFormData = (formData: any): boolean => {
  if (formData === null || !formData) return false;

  const checkData = (fieldName: string) =>
    fieldName in formData &&
    Array.isArray(formData[fieldName]) &&
    formData[fieldName].length > 0;

  return (
    checkData("accommodationData") ||
    checkData("cityData") ||
    checkData("scopeData") ||
    checkData("itineraryData") ||
    checkData("pricelistData") ||
    checkData("processData") ||
    checkData("paymentData") ||
    checkData("termData") ||
    checkData("documentData")
  );
};

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formType, setFormType] = useState<FormType>("accommodation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    deleteMutations,
    fileMutation,
    fileAddMutation,
    fileDeleteMutation,
    invalidateQueries,
  } = useFormMutations();

  const accommodationFormRef = useRef<AccommodationFormHandle>(null);
  const cityFormRef = useRef<CityFormHandle>(null);
  const scopeFormRef = useRef<ScopeFormHandle>(null);
  const itineraryFormRef = useRef<ItineraryFormHandle>(null);
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
      if ((!fileData || fileData.length === 0) && !existingFileId) return "";
      if ((!fileData || fileData.length === 0) && existingFileId)
        return existingFileId;

      const formData = new FormData();
      formData.append("type", "file");
      formData.append(
        "fileTitle",
        fileTitle?.trim() || (existingFileId ? "Updated File" : "New File"),
      );

      const filesArray = Array.from(fileData!);
      filesArray.forEach((file: File) => formData.append("file", file));

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

  const handleDelete = useCallback(
    async (
      type: FormType,
      itemId: string,
      index: number,
      formRef: React.RefObject<any>,
      successMessage: string,
    ) => {
      if (
        !itemId ||
        !window.confirm(`Are you sure you want to delete this ${type}?`)
      )
        return;

      try {
        setDeletingId(itemId);
        await deleteMutations[type as keyof typeof deleteMutations].mutateAsync(
          itemId,
        );

        const formHandle = formRef.current as any;
        const removeMethod = `remove${type.charAt(0).toUpperCase() + type.slice(1)}Field`;
        if (formHandle && formHandle[removeMethod]) {
          formHandle[removeMethod](index);
        }

        setEditData((prev) => ({
          ...prev,
          [type]:
            prev[type as keyof EditData]?.filter((_, i) => i !== index) || [],
        }));

        if (["pricelist", "process", "term", "document"].includes(type)) {
          setFileData((prev) => ({
            ...prev,
            [type]:
              prev[type as keyof FileData]?.filter((_, i) => i !== index) || [],
          }));

          const setFileIdsMap: Record<
            string,
            React.Dispatch<React.SetStateAction<string[][]>>
          > = {
            pricelist: setPricelistFileIds,
            process: setProcessFileIds,
            term: setTermFileIds,
            document: setDocumentFileIds,
          };
          if (setFileIdsMap[type]) {
            setFileIdsMap[type]((prev) => prev.filter((_, i) => i !== index));
          }
        }

        showMessage({
          message: successMessage,
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error(`Error deleting ${type}:`, error);
        showMessage({
          message: error.message || `Error deleting ${type}`,
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [
      deleteMutations,
      setEditData,
      setFileData,
      setPricelistFileIds,
      setProcessFileIds,
      setTermFileIds,
      setDocumentFileIds,
      showMessage,
    ],
  );

  const handleDeleteAccommodation = useCallback(
    (accommodationId: string, index: number) =>
      handleDelete(
        "accommodation",
        accommodationId,
        index,
        accommodationFormRef,
        "Accommodation deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeleteCity = useCallback(
    (cityId: string, index: number) =>
      handleDelete(
        "city",
        cityId,
        index,
        cityFormRef,
        "City deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeleteScope = useCallback(
    (scopeId: string, index: number) =>
      handleDelete(
        "scope",
        scopeId,
        index,
        scopeFormRef,
        "Scope deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeleteItinerary = useCallback(
    (itineraryId: string, index: number) =>
      handleDelete(
        "itinerary",
        itineraryId,
        index,
        itineraryFormRef,
        "Itinerary deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeletePricelist = useCallback(
    (pricelistId: string, index: number) =>
      handleDelete(
        "pricelist",
        pricelistId,
        index,
        pricelistFormRef,
        "Pricelist deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeleteProcess = useCallback(
    (processId: string, index: number) =>
      handleDelete(
        "process",
        processId,
        index,
        processFormRef,
        "Process deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeletePayment = useCallback(
    (paymentId: string, index: number) =>
      handleDelete(
        "payment",
        paymentId,
        index,
        paymentFormRef,
        "Payment deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeleteTerm = useCallback(
    (termId: string, index: number) =>
      handleDelete(
        "term",
        termId,
        index,
        termFormRef,
        "Term deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeleteDocument = useCallback(
    (documentId: string, index: number) =>
      handleDelete(
        "document",
        documentId,
        index,
        documentFormRef,
        "Document deleted successfully!",
      ),
    [handleDelete],
  );

  const handleDeleteFile = useCallback(
    async (fileId: string, fileType: FormType, index?: number) => {
      if (
        !fileId ||
        !window.confirm(
          `Are you sure you want to delete this ${fileType} file?`,
        )
      )
        return;

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
        accommodation: "accommodation",
        city: "city",
        scope: "scope",
        itinerary: "itinerary",
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

  const processFormSubmission = async (
    formData: any,
    formType: string,
    fileIds: string[][],
    setFileIds: React.Dispatch<React.SetStateAction<string[][]>>,
    editDataArray: any[],
  ) => {
    if (!formData || !hasFormData(formData)) return [];

    const { [`${formType}Data`]: data, [`${formType}FileData`]: fileData } =
      formData;
    const safeFileData = Array.isArray(fileData) ? fileData : [fileData];
    const safeData = Array.isArray(data) ? data : [data];

    const fileUploadPromises: Promise<string>[] = safeFileData.map(
      (fileDataItem, i) => {
        const existingFileId = fileIds[i]?.[0] || "";
        if (fileDataItem?.file && fileDataItem.file.length > 0) {
          return handleFile(
            fileDataItem.file,
            fileDataItem.fileTitle,
            existingFileId,
          );
        }
        return Promise.resolve(existingFileId);
      },
    );

    const uploadedFileIds = await Promise.all(fileUploadPromises);
    setFileIds(uploadedFileIds.map((fileId) => [fileId]));

    const submissions = [];
    const editArray = Array.isArray(editDataArray)
      ? editDataArray
      : [editDataArray].filter(Boolean);

    for (let i = 0; i < safeData.length; i++) {
      const item = safeData[i];
      const formDataToSubmit = new FormData();

      if (formType === "pricelist") {
        formDataToSubmit.append("type", "price");
        formDataToSubmit.append("plan", item.plan || "");
        formDataToSubmit.append("fee", item.fee || "");
        formDataToSubmit.append("description", item.description || "");
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

      formDataToSubmit.append("tour", id!);

      if (uploadedFileIds[i]) {
        formDataToSubmit.append("filesAssociated", uploadedFileIds[i]);
      }

      const hasExistingData = !!editArray[i]?._id;
      const mutation = getMutationFunction(
        formType === "pricelist" ? "price" : formType,
        hasExistingData,
      );

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

  const processNonFileFormSubmission = async (
    formData: any,
    formType: string,
    editDataArray: any[],
  ) => {
    if (!formData || !hasFormData(formData)) return [];

    const { [`${formType}Data`]: data } = formData;
    const safeData = Array.isArray(data) ? data : [data];
    const submissions = [];
    const editArray = Array.isArray(editDataArray)
      ? editDataArray
      : [editDataArray].filter(Boolean);

    for (let i = 0; i < safeData.length; i++) {
      const item = safeData[i];

      if (formType === "itinerary") {
        // Special handling for itinerary
        const itineraryPayload: AddItineraryPayload = {
          type: "tour-itinerary",
          tour: id!,
          title: item.title || "",
          location: item.location || "",
          dayOrder: parseInt(item.dayOrder) || 0,
          activities: Array.isArray(item.activities) ? item.activities : [],
          meals: Array.isArray(item.meals)
            ? item.meals.map((meal: any) => ({
                ...meal,
                mealCount: String(meal.mealCount || ""),
              }))
            : [],
        };

        const hasExistingData = !!editArray[i]?._id;
        const mutation = getMutationFunction("itinerary", hasExistingData);

        if (hasExistingData) {
          submissions.push(
            (mutation as any).mutateAsync({
              id: editArray[i]._id,
              data: itineraryPayload,
            }),
          );
        } else {
          submissions.push((mutation as any).mutateAsync(itineraryPayload));
        }
      } else {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("type", `tour-${formType}`);
        formDataToSubmit.append("tour", id!);

        switch (formType) {
          case "accommodation":
            formDataToSubmit.append(
              "accommodationName",
              item.accommodationName || "",
            );
            formDataToSubmit.append(
              "accommodationDescription",
              item.accommodationDescription || "",
            );
            formDataToSubmit.append(
              "accommodationStar",
              item.accommodationStar || "",
            );
            formDataToSubmit.append(
              "accommodationWebsite",
              item.accommodationWebsite || "",
            );
            if (item.images) {
              if (item.images instanceof FileList) {
                Array.from(item.images).forEach((file: any) => {
                  if (file instanceof File)
                    formDataToSubmit.append("accommodationImages", file);
                });
              }
            }
            break;
          case "city":
            formDataToSubmit.append("city", item.city || "");
            break;
          case "scope":
            formDataToSubmit.append("scopeCategory", item.scopeCategory || "");
            formDataToSubmit.append("scopeType", item.scopeType || "");
            formDataToSubmit.append("scopeTitle", item.scopeTitle || "");
            formDataToSubmit.append(
              "scopeDescription",
              item.scopeDescription || "",
            );
            break;
          case "payment":
            formDataToSubmit.append("paymentType", item.paymentType || "");
            formDataToSubmit.append("currency", item.currency || "");
            formDataToSubmit.append("accountName", item.accountName || "");
            formDataToSubmit.append("bankName", item.bankName || "");
            formDataToSubmit.append("accountNo", item.accountNo || "");
            formDataToSubmit.append("bankAddress", item.bankAddress || "");
            formDataToSubmit.append("swiftCode", item.swiftCode || "");
            break;
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
    }

    return submissions;
  };

  const handleFinalSubmit = async () => {
    if (!id) {
      showMessage({
        message: "No tour ID found. Please select a tour first.",
        type: "error",
        action: "addOrUpdate",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const [
        accommodationFormData,
        cityFormData,
        scopeFormData,
        itineraryFormData,
        pricelistFormData,
        processFormData,
        paymentFormData,
        termFormData,
        documentFormData,
      ] = await Promise.all([
        accommodationFormRef.current?.getFormData(),
        cityFormRef.current?.getFormData(),
        scopeFormRef.current?.getFormData(),
        itineraryFormRef.current?.getFormData(),
        pricelistFormRef.current?.getFormData(),
        processFormRef.current?.getFormData(),
        paymentFormRef.current?.getFormData(),
        termFormRef.current?.getFormData(),
        documentFormRef.current?.getFormData(),
      ]);

      const formResults = [
        { data: accommodationFormData, type: "accommodation" },
        { data: cityFormData, type: "city" },
        { data: scopeFormData, type: "scope" },
        { data: itineraryFormData, type: "itinerary" },
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
        processNonFileFormSubmission(
          accommodationFormData,
          "accommodation",
          editData.accommodation || [],
        ),
        processNonFileFormSubmission(cityFormData, "city", editData.city || []),
        processNonFileFormSubmission(
          scopeFormData,
          "scope",
          editData.scope || [],
        ),
        processNonFileFormSubmission(
          itineraryFormData,
          "itinerary",
          editData.itinerary || [],
        ),
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
      ]);

      const flattenedSubmissions = allSubmissions.flat();
      await Promise.all(flattenedSubmissions);
      invalidateQueries();

      showMessage({
        message: "Tour information updated successfully!",
        type: "success",
        action: "addOrUpdate",
      });

      setTimeout(() => {
        navigate("/tours");
      }, 2000);
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
    accommodation: {
      ref: accommodationFormRef,
      editData: editData.accommodation || [],
      onDeleteAccommodation: handleDeleteAccommodation,
      isDeletingAccommodation: deletingId !== null,
    },
    city: {
      ref: cityFormRef,
      editData: editData.city || [],
      onDeleteCity: handleDeleteCity,
      isDeletingCity: deletingId !== null,
    },
    scope: {
      ref: scopeFormRef,
      editData: editData.scope || [],
      onDeleteScope: handleDeleteScope,
      isDeletingScope: deletingId !== null,
    },
    itinerary: {
      ref: itineraryFormRef,
      editData: editData.itinerary || [],
      onDeleteItinerary: handleDeleteItinerary,
      isDeletingItinerary: deletingId !== null,
    },
    pricelist: {
      ref: pricelistFormRef,
      editData: editData.pricelist || [],
      fileData: fileData.pricelist || [],
      onDeleteFile: (index: number, fileId: string) =>
        handleDeleteFile(fileId, "pricelist", index),
      onDeletePricelist: handleDeletePricelist,
      isDeleting: deletingFileId !== null,
      isDeletingPricelist: deletingId !== null,
    },
    process: {
      ref: processFormRef,
      editData: editData.process || [],
      fileData: fileData.process || [],
      onDeleteFile: (index: number, fileId: string) =>
        handleDeleteFile(fileId, "process", index),
      onDeleteProcess: handleDeleteProcess,
      isDeleting: deletingFileId !== null,
      isDeletingProcess: deletingId !== null,
    },
    payment: {
      ref: paymentFormRef,
      editData: editData.payment || [],
      onDeletePayment: handleDeletePayment,
      isDeletingPayment: deletingId !== null,
    },
    term: {
      ref: termFormRef,
      editData: editData.term || [],
      fileData: fileData.term || [],
      onDeleteFile: (index: number, fileId: string) =>
        handleDeleteFile(fileId, "term", index),
      onDeleteTerm: handleDeleteTerm,
      isDeleting: deletingFileId !== null,
      isDeletingTerm: deletingId !== null,
    },
    document: {
      ref: documentFormRef,
      editData: editData.document || [],
      fileData: fileData.document || [],
      onDeleteFile: (index: number, fileId: string) =>
        handleDeleteFile(fileId, "document", index),
      onDeleteDocument: handleDeleteDocument,
      isDeleting: deletingFileId !== null,
      isDeletingDocument: deletingId !== null,
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
            {type === "accommodation" && (
              <EditAccommodationForm {...formProps.accommodation} />
            )}
            {type === "city" && <EditCityForm {...formProps.city} />}
            {type === "scope" && <EditScopeForm {...formProps.scope} />}
            {type === "itinerary" && (
              <EditItineraryForm {...formProps.itinerary} />
            )}
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
            title="Save Tour Information"
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
            if (
              message.type === "success" &&
              message.action === "addOrUpdate"
            ) {
              navigate("/tours");
            }
          }}
        />
      )}
    </>
  );
};

export default Edit;
