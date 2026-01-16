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

interface FormSubmission {
  type: FormType;
  data: any;
  fileId?: string;
  existingData: any;
}

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

const getBackendType = (type: FormType): string => {
  const typeMap: Record<FormType, string> = {
    accommodation: "tour-accommodation",
    city: "tour-city",
    scope: "tour-scope",
    itinerary: "tour-itinerary",
    pricelist: "price",
    process: "process",
    payment: "payment",
    term: "terms",
    document: "document",
  };
  return typeMap[type];
};

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

        const accommodationArray = Array.isArray(accommodationData)
          ? accommodationData
          : [accommodationData].filter(Boolean);
        const cityArray = Array.isArray(cityData)
          ? cityData
          : [cityData].filter(Boolean);
        const scopeArray = Array.isArray(scopeData)
          ? scopeData
          : [scopeData].filter(Boolean);
        const itineraryArray = Array.isArray(itineraryData)
          ? itineraryData
          : [itineraryData].filter(Boolean);
        const pricelistArray = Array.isArray(pricelistData)
          ? pricelistData
          : [pricelistData].filter(Boolean);
        const processArray = Array.isArray(processData)
          ? processData
          : [processData].filter(Boolean);
        const paymentArray = Array.isArray(paymentData)
          ? paymentData
          : [paymentData].filter(Boolean);
        const termArray = Array.isArray(termData)
          ? termData
          : [termData].filter(Boolean);
        const documentArray = Array.isArray(documentData)
          ? documentData
          : [documentData].filter(Boolean);

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

        const pricelistFileIdsArray = pricelistArray.map((pricelist) =>
          pricelist?.filesAssociated
            ? Array.isArray(pricelist.filesAssociated)
              ? pricelist.filesAssociated
              : [pricelist.filesAssociated]
            : []
        );
        setPricelistFileIds(pricelistFileIdsArray);

        const processFileIdsArray = processArray.map((processItem) =>
          processItem?.filesAssociated
            ? Array.isArray(processItem.filesAssociated)
              ? processItem.filesAssociated
              : [processItem.filesAssociated]
            : []
        );
        setProcessFileIds(processFileIdsArray);

        const termFileIdsArray = termArray.map((termItem) =>
          termItem?.filesAssociated
            ? Array.isArray(termItem.filesAssociated)
              ? termItem.filesAssociated
              : [termItem.filesAssociated]
            : []
        );
        setTermFileIds(termFileIdsArray);

        const documentFileIdsArray = documentArray.map((documentItem) =>
          documentItem?.filesAssociated
            ? Array.isArray(documentItem.filesAssociated)
              ? documentItem.filesAssociated
              : [documentItem.filesAssociated]
            : []
        );
        setDocumentFileIds(documentFileIdsArray);

        const fileFetchPromises: Promise<FileFetchResult>[] = [];

        pricelistArray.forEach((pricelist, index) => {
          if (pricelist?.filesAssociated) {
            const fileId = Array.isArray(pricelist.filesAssociated)
              ? pricelist.filesAssociated[0]
              : pricelist.filesAssociated;
            fileFetchPromises.push(
              fetchTourFile(fileId).then((file) => ({
                type: "pricelist" as const,
                data: file,
                index,
              }))
            );
          }
        });

        processArray.forEach((processItem, index) => {
          if (processItem?.filesAssociated) {
            const fileId = Array.isArray(processItem.filesAssociated)
              ? processItem.filesAssociated[0]
              : processItem.filesAssociated;
            fileFetchPromises.push(
              fetchTourFile(fileId).then((file) => ({
                type: "process" as const,
                data: file,
                index,
              }))
            );
          }
        });

        termArray.forEach((termItem, index) => {
          if (termItem?.filesAssociated) {
            const fileId = Array.isArray(termItem.filesAssociated)
              ? termItem.filesAssociated[0]
              : termItem.filesAssociated;
            fileFetchPromises.push(
              fetchTourFile(fileId).then((file) => ({
                type: "term" as const,
                data: file,
                index,
              }))
            );
          }
        });

        documentArray.forEach((documentItem, index) => {
          if (documentItem?.filesAssociated) {
            const fileId = Array.isArray(documentItem.filesAssociated)
              ? documentItem.filesAssociated[0]
              : documentItem.filesAssociated;
            fileFetchPromises.push(
              fetchTourFile(fileId).then((file) => ({
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
      } catch (error) {
        console.error("Error fetching edit data:", error);
        alert("Error loading existing tour data. Please try again.");
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

  const deleteAccommodationMutation = useMutation({
    mutationFn: deleteAccommodation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accommodations"],
        exact: false,
      });
    },
  });

  const deleteCityMutation = useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"], exact: false });
    },
  });

  const deleteScopeMutation = useMutation({
    mutationFn: deleteScope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scopes"], exact: false });
    },
  });

  const deleteItineraryMutation = useMutation({
    mutationFn: deleteItinerary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["itineraries"],
        exact: false,
      });
    },
  });

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

  const deletePaymentMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"], exact: false });
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
    deleteAccommodationMutation,
    deleteCityMutation,
    deleteScopeMutation,
    deleteItineraryMutation,
    deletePricelistMutation,
    deleteProcessMutation,
    deletePaymentMutation,
    deleteTermMutation,
    deleteDocumentMutation,
    fileMutation,
    fileAddMutation,
    fileDeleteMutation,
    invalidateQueries,
  };
};

interface ActivityData {
  activityType: string;
  information: string;
}

interface MealData {
  mealType: string;
  mealCount: string;
  mealUnit: string;
  description: string;
}

interface ItineraryFormData {
  title: string;
  location: string;
  dayOrder: string;
  activities: ActivityData[];
  meals: MealData[];
}

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formType, setFormType] = useState<FormType>("accommodation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deletingAccommodationId, setDeletingAccommodationId] = useState<
    string | null
  >(null);
  const [deletingCityId, setDeletingCityId] = useState<string | null>(null);
  const [deletingScopeId, setDeletingScopeId] = useState<string | null>(null);
  const [deletingItineraryId, setDeletingItineraryId] = useState<string | null>(
    null
  );
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
    deleteAccommodationMutation,
    deleteCityMutation,
    deleteScopeMutation,
    deleteItineraryMutation,
    deletePricelistMutation,
    deleteProcessMutation,
    deletePaymentMutation,
    deleteTermMutation,
    deleteDocumentMutation,
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
      existingFileId?: string
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
    [fileMutation, fileAddMutation, showMessage]
  );

  const handleDeleteAccommodation = useCallback(
    async (accommodationId: string, index: number) => {
      if (
        !accommodationId ||
        !window.confirm("Are you sure you want to delete this accommodation?")
      ) {
        return;
      }

      try {
        setDeletingAccommodationId(accommodationId);
        await deleteAccommodationMutation.mutateAsync(accommodationId);

        const formHandle = accommodationFormRef.current as any;
        if (formHandle.removeAccommodationField) {
          formHandle.removeAccommodationField(index);
        }

        setEditData((prev) => ({
          ...prev,
          accommodation:
            prev.accommodation?.filter((_, i) => i !== index) || [],
        }));

        showMessage({
          message: "Accommodation deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting accommodation:", error);
        showMessage({
          message: error.message || "Error deleting accommodation",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingAccommodationId(null);
      }
    },
    [deleteAccommodationMutation, setEditData, showMessage]
  );

  const handleDeleteCity = useCallback(
    async (cityId: string, index: number) => {
      if (
        !cityId ||
        !window.confirm("Are you sure you want to delete this city?")
      ) {
        return;
      }

      try {
        setDeletingCityId(cityId);
        await deleteCityMutation.mutateAsync(cityId);

        const formHandle = cityFormRef.current as any;
        if (formHandle.removeCityField) {
          formHandle.removeCityField(index);
        }

        setEditData((prev) => ({
          ...prev,
          city: prev.city?.filter((_, i) => i !== index) || [],
        }));

        showMessage({
          message: "City deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting city:", error);
        showMessage({
          message: error.message || "Error deleting city",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingCityId(null);
      }
    },
    [deleteCityMutation, setEditData, showMessage]
  );

  const handleDeleteScope = useCallback(
    async (scopeId: string, index: number) => {
      if (
        !scopeId ||
        !window.confirm("Are you sure you want to delete this scope?")
      ) {
        return;
      }

      try {
        setDeletingScopeId(scopeId);
        await deleteScopeMutation.mutateAsync(scopeId);

        const formHandle = scopeFormRef.current as any;
        if (formHandle.removeScopeField) {
          formHandle.removeScopeField(index);
        }

        setEditData((prev) => ({
          ...prev,
          scope: prev.scope?.filter((_, i) => i !== index) || [],
        }));

        showMessage({
          message: "Scope deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting scope:", error);
        showMessage({
          message: error.message || "Error deleting scope",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingScopeId(null);
      }
    },
    [deleteScopeMutation, setEditData, showMessage]
  );

  const handleDeleteItinerary = useCallback(
    async (itineraryId: string, index: number) => {
      if (!itineraryId || itineraryId.trim() === "") {
        console.error("Invalid or empty itinerary ID:", itineraryId);
        showMessage({
          message: "Cannot delete: Invalid itinerary ID",
          type: "error",
          action: "delete",
        });
        return;
      }

      if (
        !window.confirm("Are you sure you want to delete this itinerary day?")
      ) {
        return;
      }

      try {
        setDeletingItineraryId(itineraryId);
        await deleteItineraryMutation.mutateAsync(itineraryId);

        setEditData((prev) => {
          const newItineraries = [...(prev.itinerary || [])];
          newItineraries.splice(index, 1);
          return {
            ...prev,
            itinerary: newItineraries,
          };
        });

        showMessage({
          message: "Itinerary deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting itinerary:", error);

        if (
          error.message?.includes("404") ||
          error.message?.includes("not found")
        ) {
          setEditData((prev) => {
            const newItineraries = [...(prev.itinerary || [])];
            newItineraries.splice(index, 1);
            return {
              ...prev,
              itinerary: newItineraries,
            };
          });
          showMessage({
            message: "Itinerary removed from UI (was already deleted)",
            type: "success",
            action: "delete",
          });
        } else {
          showMessage({
            message: `Error deleting itinerary: ${
              error.message || "Unknown error"
            }`,
            type: "error",
            action: "delete",
          });
        }
      } finally {
        setDeletingItineraryId(null);
      }
    },
    [deleteItineraryMutation, setEditData, showMessage]
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
    ]
  );

  const handleDeleteProcess = useCallback(
    async (processId: string, index: number) => {
      if (
        !processId ||
        !window.confirm("Are you sure you want to delete this process?")
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
          message: "Process deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting process:", error);
        showMessage({
          message: error.message || "Error deleting process",
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

  const handleDeletePayment = useCallback(
    async (paymentId: string, index: number) => {
      if (
        !paymentId ||
        !window.confirm("Are you sure you want to delete this payment?")
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
          message: "Payment deleted successfully!",
          type: "success",
          action: "delete",
        });
      } catch (error: any) {
        console.error("Error deleting payment:", error);
        showMessage({
          message: error.message || "Error deleting payment",
          type: "error",
          action: "delete",
        });
      } finally {
        setDeletingPaymentId(null);
      }
    },
    [deletePaymentMutation, setEditData, showMessage]
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
    [deleteTermMutation, setEditData, setFileData, setTermFileIds, showMessage]
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
    ]
  );

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
          accommodation: () => {},
          city: () => {},
          scope: () => {},
          itinerary: () => {},
          payment: () => {},
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

  const getMutationFunction = useCallback(
    (type: string, hasExistingData: boolean) => {
      const typeMapping: Record<string, keyof typeof updateMutations> = {
        accommodation: "accommodation",
        city: "city",
        scope: "scope",
        itinerary: "itinerary",
        pricelist: "pricelist",
        process: "process",
        payment: "payment",
        term: "term",
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

  const hasFormData = (formData: any, type: string): boolean => {
    if (!formData) return false;

    const fieldMap: Record<string, string> = {
      accommodation: "accommodationData",
      city: "cityData",
      scope: "scopeData",
      itinerary: "itineraryData",
      pricelist: "pricelistData",
      process: "processData",
      payment: "paymentData",
      term: "termData",
      document: "documentData",
    };

    const dataField = fieldMap[type];
    return (
      dataField &&
      formData[dataField] &&
      Array.isArray(formData[dataField]) &&
      formData[dataField].length > 0
    );
  };

  const handleFinalSubmit = useCallback(async () => {
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
      const formDataPromises = [
        accommodationFormRef.current?.getFormData(),
        cityFormRef.current?.getFormData(),
        scopeFormRef.current?.getFormData(),
        itineraryFormRef.current?.getFormData(),
        pricelistFormRef.current?.getFormData(),
        processFormRef.current?.getFormData(),
        paymentFormRef.current?.getFormData(),
        termFormRef.current?.getFormData(),
        documentFormRef.current?.getFormData(),
      ];

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
      ] = await Promise.all(formDataPromises);

      const formChecks = [
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

      const submissions: FormSubmission[] = [];

      if (
        hasFormData(accommodationFormData, "accommodation") &&
        accommodationFormData
      ) {
        const { accommodationData } = accommodationFormData as {
          accommodationData: any[];
        };
        const safeAccommodationData = Array.isArray(accommodationData)
          ? accommodationData
          : [accommodationData];
        const editAccommodationArray = Array.isArray(editData.accommodation)
          ? editData.accommodation
          : [editData.accommodation].filter(Boolean);

        safeAccommodationData.forEach((data, index) => {
          if (
            data &&
            (data.accommodationName ||
              data.accommodationDescription ||
              data.accommodationStar)
          ) {
            submissions.push({
              type: "accommodation",
              data,
              existingData: editAccommodationArray[index],
            });
          }
        });
      }

      if (hasFormData(cityFormData, "city") && cityFormData) {
        const { cityData } = cityFormData as { cityData: any[] };
        const safeCityData = Array.isArray(cityData) ? cityData : [cityData];
        const editCityArray = Array.isArray(editData.city)
          ? editData.city
          : [editData.city].filter(Boolean);

        safeCityData.forEach((data, index) => {
          if (data && data.city) {
            submissions.push({
              type: "city",
              data,
              existingData: editCityArray[index],
            });
          }
        });
      }

      if (hasFormData(scopeFormData, "scope") && scopeFormData) {
        const { scopeData } = scopeFormData as { scopeData: any[] };
        const safeScopeData = Array.isArray(scopeData)
          ? scopeData
          : [scopeData];
        const editScopeArray = Array.isArray(editData.scope)
          ? editData.scope
          : [editData.scope].filter(Boolean);

        safeScopeData.forEach((data, index) => {
          if (
            data &&
            (data.scopeCategory || data.scopeType || data.scopeTitle)
          ) {
            submissions.push({
              type: "scope",
              data,
              existingData: editScopeArray[index],
            });
          }
        });
      }

      if (hasFormData(itineraryFormData, "itinerary") && itineraryFormData) {
        const { itineraryData } = itineraryFormData as {
          itineraryData: ItineraryFormData[];
        };
        const safeItineraryData = Array.isArray(itineraryData)
          ? itineraryData
          : [itineraryData];
        const editItineraryArray = Array.isArray(editData.itinerary)
          ? editData.itinerary
          : [editData.itinerary].filter(Boolean);

        safeItineraryData.forEach((data, index) => {
          if (data && (data.title || data.location || data.dayOrder)) {
            const filteredActivities = Array.isArray(data.activities)
              ? data.activities.filter(
                  (activity) =>
                    activity?.activityType?.trim() ||
                    activity?.information?.trim()
                )
              : [];

            const filteredMeals = Array.isArray(data.meals)
              ? data.meals.filter(
                  (meal) => meal?.mealType?.trim() || meal?.description?.trim()
                )
              : [];

            const processedMeals = filteredMeals.map((meal) => ({
              ...meal,
              mealCount: String(meal.mealCount || ""),
            }));

            const itineraryPayload: AddItineraryPayload = {
              type: "tour-itinerary",
              tour: id,
              title: data.title || "",
              location: data.location || "",
              dayOrder: parseInt(data.dayOrder) || 0,
              activities: filteredActivities,
              meals: processedMeals,
            };

            submissions.push({
              type: "itinerary",
              data: itineraryPayload,
              existingData: editItineraryArray[index],
            });
          }
        });
      }

      if (hasFormData(pricelistFormData, "pricelist") && pricelistFormData) {
        const { pricelistData, pricelistFileData } = pricelistFormData as {
          pricelistData: any[];
          pricelistFileData?: any;
        };

        let safePricelistFileData: any[] = [];
        if (Array.isArray(pricelistFileData)) {
          safePricelistFileData = pricelistFileData;
        } else if (pricelistFileData && typeof pricelistFileData === "object") {
          safePricelistFileData = [pricelistFileData];
        }

        const pricelistArray = Array.isArray(pricelistData)
          ? pricelistData
          : [pricelistData];

        const pricelistFilePromises = pricelistArray.map(async (_, index) => {
          const fileData = safePricelistFileData[index];
          const existingFileId = pricelistFileIds[index]?.[0] || "";

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
          if (data && (data.plan || data.fee || data.description)) {
            submissions.push({
              type: "pricelist",
              data,
              fileId: pricelistFileIdResults[index] || "",
              existingData: editPricelistArray[index],
            });
          }
        });
      }

      if (hasFormData(processFormData, "process") && processFormData) {
        const { processData, processFileData } = processFormData as {
          processData: any[];
          processFileData?: any;
        };

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

      if (hasFormData(paymentFormData, "payment") && paymentFormData) {
        const { paymentData } = paymentFormData as { paymentData: any[] };
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
              existingData: editPaymentArray[index],
            });
          }
        });
      }

      if (hasFormData(termFormData, "term") && termFormData) {
        const { termData, termFileData } = termFormData as {
          termData: any[];
          termFileData?: any;
        };

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
              type: "term",
              data,
              fileId: termFileIdResults[index] || "",
              existingData: editTermArray[index],
            });
          }
        });
      }

      if (hasFormData(documentFormData, "document") && documentFormData) {
        const { documentData, documentFileData } = documentFormData as {
          documentData: any[];
          documentFileData?: any;
        };

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

      // Process submissions SEQUENTIALLY instead of in parallel
      for (const submission of submissions) {
        const { type, data, fileId, existingData } = submission;
        const hasExistingData = !!existingData?._id;
        const mutation = getMutationFunction(type, hasExistingData);
        const backendType = getBackendType(type);

        if (type === "itinerary") {
          const itineraryPayload = data as AddItineraryPayload;

          if (hasExistingData) {
            await (mutation as any).mutateAsync({
              id: existingData._id,
              data: itineraryPayload,
            });
          } else {
            await (mutation as any).mutateAsync(itineraryPayload);
          }
        } else {
          const formData = new FormData();
          formData.append("type", backendType);
          formData.append("tour", id);

          if (fileId && fileId.trim() && fileId !== "undefined") {
            formData.append("filesAssociated", fileId);
          }

          const fieldMappings: Record<string, () => void> = {
            accommodation: () => {
              formData.append(
                "accommodationName",
                data.accommodationName || ""
              );
              formData.append(
                "accommodationDescription",
                data.accommodationDescription || ""
              );
              formData.append(
                "accommodationStar",
                data.accommodationStar || ""
              );
              formData.append(
                "accommodationWebsite",
                data.accommodationWebsite || ""
              );

              if (data.images) {
                if (data.images instanceof FileList) {
                  const filesArray = Array.from(data.images);
                  filesArray.forEach((file: any) => {
                    if (file && file instanceof File) {
                      formData.append("accommodationImages", file);
                    }
                  });
                } else if (Array.isArray(data.images)) {
                  data.images.forEach((file: File) => {
                    if (file && file instanceof File) {
                      formData.append("accommodationImages", file);
                    }
                  });
                }
              }
            },
            city: () => {
              formData.append("city", data.city || "");
            },
            scope: () => {
              formData.append("scopeCategory", data.scopeCategory || "");
              formData.append("scopeType", data.scopeType || "");
              formData.append("scopeTitle", data.scopeTitle || "");
              formData.append("scopeDescription", data.scopeDescription || "");
            },
            pricelist: () => {
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
            term: () => {
              formData.append("title", data.title || "");
              formData.append("terms", data.terms || "");
            },
            document: () => {
              formData.append("docTitle", data.docTitle || "");
              formData.append("docDescription", data.docDescription || "");
            },
          };

          if (fieldMappings[type]) {
            fieldMappings[type]();
          }

          if (hasExistingData) {
            await (mutation as any).mutateAsync({
              id: existingData._id,
              data: formData,
            });
          } else {
            await (mutation as any).mutateAsync(formData);
          }
        }
      }

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
          "There was an error updating the tour. Please try again.",
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
    navigate,
  ]);

  const isLoading = isLoadingData || isSubmitting;

  if (isLoadingData) return <PageLoader />;

  const formProps = {
    accommodation: {
      ref: accommodationFormRef,
      editData: editData.accommodation || [],
      onDeleteAccommodation: handleDeleteAccommodation,
      isDeletingAccommodation: deletingAccommodationId !== null,
    },
    city: {
      ref: cityFormRef,
      editData: editData.city || [],
      onDeleteCity: handleDeleteCity,
      isDeletingCity: deletingCityId !== null,
    },
    scope: {
      ref: scopeFormRef,
      editData: editData.scope || [],
      onDeleteScope: handleDeleteScope,
      isDeletingScope: deletingScopeId !== null,
    },
    itinerary: {
      ref: itineraryFormRef,
      editData: editData.itinerary || [],
      onDeleteItinerary: handleDeleteItinerary,
      isDeletingItinerary: deletingItineraryId !== null,
    },
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
