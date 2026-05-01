import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { addAccomodation } from "../../../../hooks/tours/accomodation/accomodation";
import { addCity } from "../../../../hooks/tours/city/city";
import { addScope } from "../../../../hooks/tours/scope/scope";
import ActionButton from "../../../button/ActionButton";
import type { AccommodationFormHandle } from "../addforms/AccomodationForm";
import type { CityFormHandle } from "../addforms/CityForm";
import type { ScopeFormHandle } from "../addforms/ScopeForm";
import type { ItineraryFormHandle } from "../addforms/ItineraryForm";
import type { PricelistFormHandle } from "../../../visa/PricelistForm";
import type { ProcessFormHandle } from "../../../visa/ProcessForm";
import type { PaymentFormHandle } from "../../../visa/PaymentForm";
import type { TermFormHandle } from "../../../visa/TermForm";
import type { FaqsFormHandle } from "../../../visa/FaqsForm";
import AccommodationForm from "../addforms/AccomodationForm";
import CityForm from "../addforms/CityForm";
import ScopeForm from "../addforms/ScopeForm";
import ItineraryForm from "../addforms/ItineraryForm";
import { addVisaFile } from "../../../../hooks/visa/file/addVisaFile";
import { addPriceList } from "../../../../hooks/visa/pricelist/addPriceList";
import { addProcess } from "../../../../hooks/visa/process/addProcess";
import { addPayment } from "../../../../hooks/visa/payment/addPayment";
import PaymentForm from "../../../visa/PaymentForm";
import ProcessForm from "../../../visa/ProcessForm";
import PricelistForm from "../../../visa/PricelistForm";
import FaqsForm from "../../../visa/FaqsForm";
import FormTabs from "../../FormTab";
import { addTerm } from "../../../../hooks/visa/terms/addTerm";
import TermForm from "../../../visa/TermForm";
import type { DocumentFormHandle } from "../../../visa/DocumentForm";
import { addDocument } from "../../../../hooks/visa/document/addDocument";
import DocumentForm from "../../../visa/DocumentForm";
import {
  addItinerary,
  type AddItineraryPayload,
} from "../../../../hooks/tours/itinerary/itinerary";
import { addFaq } from "../../../../hooks/visa/faqs/faqs";

export type FormType =
  | "accommodation"
  | "city"
  | "scope"
  | "itinerary"
  | "pricelist"
  | "process"
  | "payment"
  | "term"
  | "document"
  | "faq";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formType, setFormType] = useState<FormType>("accommodation");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accommodationFormRef = useRef<AccommodationFormHandle>(null);
  const cityFormRef = useRef<CityFormHandle>(null);
  const scopeFormRef = useRef<ScopeFormHandle>(null);
  const itineraryFormRef = useRef<ItineraryFormHandle>(null);
  const pricelistFormRef = useRef<PricelistFormHandle>(null);
  const processFormRef = useRef<ProcessFormHandle>(null);
  const paymentFormRef = useRef<PaymentFormHandle>(null);
  const termFormRef = useRef<TermFormHandle>(null);
  const documentFormRef = useRef<DocumentFormHandle>(null);
  const faqFormRef = useRef<FaqsFormHandle>(null);

  const fileMutation = useMutation<string, Error, FormData>({
    mutationFn: addVisaFile,
  });

  const accommodationMutation = useMutation<string, Error, FormData>({
    mutationFn: addAccomodation,
  });

  const cityMutation = useMutation<string, Error, FormData>({
    mutationFn: addCity,
  });

  const scopeMutation = useMutation<string, Error, FormData>({
    mutationFn: addScope,
  });

  const itineraryMutation = useMutation<string, Error, AddItineraryPayload>({
    mutationFn: addItinerary,
  });

  const pricelistMutation = useMutation<string, Error, FormData>({
    mutationFn: addPriceList,
  });

  const processMutation = useMutation<string, Error, FormData>({
    mutationFn: addProcess,
  });

  const paymentMutation = useMutation<string, Error, FormData>({
    mutationFn: addPayment,
  });

  const termMutation = useMutation<string, Error, FormData>({
    mutationFn: addTerm,
  });

  const documentMutation = useMutation<string, Error, FormData>({
    mutationFn: addDocument,
  });

  const faqMutation = useMutation<string, Error, FormData>({
    mutationFn: addFaq,
  });

  const uploadFile = async (
    fileData: File[],
    fileTitle: string,
  ): Promise<string> => {
    if (!fileData || fileData.length === 0) {
      return "";
    }

    const formData = new FormData();
    formData.append("type", "file");
    formData.append("fileTitle", fileTitle);

    Array.from(fileData).forEach((file: File) => {
      formData.append("file", file);
    });

    const fileId = await fileMutation.mutateAsync(formData);
    return fileId;
  };

  const hasFormData = (formData: any): boolean => {
    if (!formData) return false;

    if (
      "accommodationData" in formData &&
      Array.isArray(formData.accommodationData) &&
      formData.accommodationData.length > 0
    ) {
      return true;
    }
    if (
      "cityData" in formData &&
      Array.isArray(formData.cityData) &&
      formData.cityData.length > 0
    ) {
      return true;
    }
    if (
      "scopeData" in formData &&
      Array.isArray(formData.scopeData) &&
      formData.scopeData.length > 0
    ) {
      return true;
    }
    if (
      "itineraryData" in formData &&
      Array.isArray(formData.itineraryData) &&
      formData.itineraryData.length > 0
    ) {
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
    if (Array.isArray(formData) && formData.length > 0) {
      return true;
    }

    return false;
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const tourId = localStorage.getItem("tourId") || "";

      if (!tourId) {
        alert("Please select a tour first.");
        setIsSubmitting(false);
        return;
      }

      const accommodationFormData =
        await accommodationFormRef.current?.getFormData();
      const cityFormData = await cityFormRef.current?.getFormData();
      const scopeFormData = await scopeFormRef.current?.getFormData();
      const itineraryFormData = await itineraryFormRef.current?.getFormData();
      const pricelistFormData = await pricelistFormRef.current?.getFormData();
      const processFormData = await processFormRef.current?.getFormData();
      const paymentFormData = await paymentFormRef.current?.getFormData();
      const termFormData = await termFormRef.current?.getFormData();
      const documentFormData = await documentFormRef.current?.getFormData();
      const faqFormData = await faqFormRef.current?.getFormData();

      // Check if accommodation form has validation errors
      if (accommodationFormData && accommodationFormData.isValid === false) {
        alert(
          "Please fix the errors in the accommodation form before submitting.",
        );
        setIsSubmitting(false);
        return;
      }

      const allFormsEmpty = [
        accommodationFormData,
        cityFormData,
        scopeFormData,
        itineraryFormData,
        pricelistFormData,
        processFormData,
        paymentFormData,
        termFormData,
        documentFormData,
        faqFormData,
      ].every((formData) => !hasFormData(formData));

      if (allFormsEmpty) {
        alert("Please fill at least one form before submitting.");
        setIsSubmitting(false);
        return;
      }

      const allSubmissions = [];

      if (accommodationFormData && hasFormData(accommodationFormData)) {
        const { accommodationData } = accommodationFormData;
        const safeAccommodationData = Array.isArray(accommodationData)
          ? accommodationData
          : [accommodationData];

        for (let i = 0; i < safeAccommodationData.length; i++) {
          const accommodationItem = safeAccommodationData[i];

          if (!accommodationItem.accommodationName?.trim()) {
            alert("Accommodation name is required.");
            setIsSubmitting(false);
            return;
          }

          if (!accommodationItem.accommodationDescription?.trim()) {
            alert("Accommodation description is required.");
            setIsSubmitting(false);
            return;
          }

          const accommodationFormDataToSubmit = new FormData();

          accommodationFormDataToSubmit.append("type", "tour-accommodation");
          accommodationFormDataToSubmit.append(
            "accommodationName",
            accommodationItem.accommodationName,
          );
          accommodationFormDataToSubmit.append(
            "accommodationDescription",
            accommodationItem.accommodationDescription,
          );
          accommodationFormDataToSubmit.append(
            "accommodationStar",
            accommodationItem.accommodationStar || "",
          );
          accommodationFormDataToSubmit.append(
            "accommodationWebsite",
            accommodationItem.accommodationWebsite || "",
          );
          accommodationFormDataToSubmit.append("tour", tourId);

          if (accommodationItem.images && accommodationItem.images.length > 0) {
            for (let j = 0; j < accommodationItem.images.length; j++) {
              const file = accommodationItem.images[j];
              accommodationFormDataToSubmit.append("accommodationImages", file);
            }
          }

          allSubmissions.push(
            accommodationMutation.mutateAsync(accommodationFormDataToSubmit),
          );
        }
      }

      if (cityFormData && hasFormData(cityFormData)) {
        const { cityData } = cityFormData;
        const safeCityData = Array.isArray(cityData) ? cityData : [cityData];

        for (let i = 0; i < safeCityData.length; i++) {
          const cityItem = safeCityData[i];
          const cityFormDataToSubmit = new FormData();

          cityFormDataToSubmit.append("type", "tour-city");
          cityFormDataToSubmit.append("city", cityItem.city);
          cityFormDataToSubmit.append("tour", tourId);

          allSubmissions.push(cityMutation.mutateAsync(cityFormDataToSubmit));
        }
      }

      if (scopeFormData && hasFormData(scopeFormData)) {
        const { scopeData } = scopeFormData;
        const safeScopeData = Array.isArray(scopeData)
          ? scopeData
          : [scopeData];

        for (let i = 0; i < safeScopeData.length; i++) {
          const scopeItem = safeScopeData[i];
          const scopeFormDataToSubmit = new FormData();

          scopeFormDataToSubmit.append("type", "tour-scope");
          scopeFormDataToSubmit.append(
            "scopeCategory",
            scopeItem.scopeCategory,
          );
          scopeFormDataToSubmit.append("scopeType", scopeItem.scopeType);
          scopeFormDataToSubmit.append("scopeTitle", scopeItem.scopeTitle);
          scopeFormDataToSubmit.append(
            "scopeDescription",
            scopeItem.scopeDescription,
          );
          scopeFormDataToSubmit.append("tour", tourId);

          allSubmissions.push(scopeMutation.mutateAsync(scopeFormDataToSubmit));
        }
      }

      if (itineraryFormData && hasFormData(itineraryFormData)) {
        const { itineraryData } = itineraryFormData;
        const safeItineraryData = Array.isArray(itineraryData)
          ? itineraryData
          : [itineraryData];

        for (let i = 0; i < safeItineraryData.length; i++) {
          const itineraryItem = safeItineraryData[i];

          const filteredActivities = Array.isArray(itineraryItem.activities)
            ? itineraryItem.activities.filter(
                (activity: any) =>
                  activity?.activityType?.trim() &&
                  activity?.information?.trim(),
              )
            : [];

          const validMeals = Array.isArray(itineraryItem.meals)
            ? itineraryItem.meals.filter(
                (meal: any) =>
                  meal?.mealType?.trim() &&
                  meal?.mealCount?.trim() &&
                  meal?.mealUnit?.trim() &&
                  meal?.description?.trim(),
              )
            : [];

          const payload: any = {
            type: "tour-itinerary",
            tour: tourId,
            title: itineraryItem.title || "",
            location: itineraryItem.location || "",
            dayOrder: parseInt(itineraryItem.dayOrder) || 0,
            activities: filteredActivities,
          };

          if (validMeals.length > 0) {
            payload.meals = validMeals.map((meal: any) => ({
              ...meal,
              mealCount: String(meal.mealCount || ""),
            }));
          }

          allSubmissions.push(itineraryMutation.mutateAsync(payload));
        }
      }

      if (pricelistFormData && hasFormData(pricelistFormData)) {
        const { pricelistData, pricelistFileData } = pricelistFormData;

        const pricelistFileUploadPromises = [];
        const safePricelistFileData = Array.isArray(pricelistFileData)
          ? pricelistFileData
          : [pricelistFileData];

        for (let i = 0; i < safePricelistFileData.length; i++) {
          const fileData = safePricelistFileData[i];
          if (fileData?.file && fileData.file.length > 0) {
            pricelistFileUploadPromises.push(
              uploadFile(
                fileData.file,
                `${fileData.fileTitle || `Pricelist ${i + 1}`}`,
              ),
            );
          } else {
            pricelistFileUploadPromises.push(Promise.resolve(""));
          }
        }

        const pricelistFileUploadIds = await Promise.all(
          pricelistFileUploadPromises,
        );
        const safePricelistData = Array.isArray(pricelistData)
          ? pricelistData
          : [pricelistData];

        for (let i = 0; i < safePricelistData.length; i++) {
          const pricelistItem = safePricelistData[i];
          const pricelistFormDataToSubmit = new FormData();
          pricelistFormDataToSubmit.append("type", "price");
          pricelistFormDataToSubmit.append("plan", pricelistItem.plan);
          pricelistFormDataToSubmit.append(
            "priceCurrency",
            pricelistItem.priceCurrency,
          );
          if (pricelistItem.fee !== undefined && pricelistItem.fee !== null) {
            pricelistFormDataToSubmit.append(
              "fee",
              pricelistItem.fee.toString(),
            );
          }
          pricelistFormDataToSubmit.append(
            "description",
            pricelistItem.description,
          );
          pricelistFormDataToSubmit.append("tour", tourId);

          if (pricelistFileUploadIds[i]) {
            pricelistFormDataToSubmit.append(
              "filesAssociated",
              pricelistFileUploadIds[i],
            );
          }

          allSubmissions.push(
            pricelistMutation.mutateAsync(pricelistFormDataToSubmit),
          );
        }
      }

      if (processFormData && hasFormData(processFormData)) {
        const { processData, processFileData } = processFormData;

        const processFileUploadPromises = [];
        const safeProcessFileData = Array.isArray(processFileData)
          ? processFileData
          : [processFileData];

        for (let i = 0; i < safeProcessFileData.length; i++) {
          const fileData = safeProcessFileData[i];
          if (fileData?.file && fileData.file.length > 0) {
            processFileUploadPromises.push(
              uploadFile(
                fileData.file,
                `${fileData.fileTitle || `Process ${i + 1}`}`,
              ),
            );
          } else {
            processFileUploadPromises.push(Promise.resolve(""));
          }
        }

        const processFileUploadIds = await Promise.all(
          processFileUploadPromises,
        );
        const safeProcessData = Array.isArray(processData)
          ? processData
          : [processData];

        for (let i = 0; i < safeProcessData.length; i++) {
          const processItem = safeProcessData[i];
          const processFormDataToSubmit = new FormData();
          processFormDataToSubmit.append("type", "process");
          processFormDataToSubmit.append(
            "processTitle",
            processItem.processTitle,
          );
          processFormDataToSubmit.append("process", processItem.process);
          processFormDataToSubmit.append("tour", tourId);

          if (processFileUploadIds[i]) {
            processFormDataToSubmit.append(
              "filesAssociated",
              processFileUploadIds[i],
            );
          }

          allSubmissions.push(
            processMutation.mutateAsync(processFormDataToSubmit),
          );
        }
      }

      if (paymentFormData && hasFormData(paymentFormData)) {
        const { paymentData } = paymentFormData;

        const safePaymentData = Array.isArray(paymentData)
          ? paymentData
          : [paymentData];

        for (let i = 0; i < safePaymentData.length; i++) {
          const paymentItem = safePaymentData[i];
          const paymentFormDataToSubmit = new FormData();
          paymentFormDataToSubmit.append("type", "payment");
          paymentFormDataToSubmit.append(
            "paymentType",
            paymentItem.paymentType,
          );
          paymentFormDataToSubmit.append("currency", paymentItem.currency);
          paymentFormDataToSubmit.append(
            "accountName",
            paymentItem.accountName,
          );
          paymentFormDataToSubmit.append("bankName", paymentItem.bankName);
          paymentFormDataToSubmit.append("accountNo", paymentItem.accountNo);
          paymentFormDataToSubmit.append(
            "bankAddress",
            paymentItem.bankAddress,
          );
          paymentFormDataToSubmit.append("swiftCode", paymentItem.swiftCode);
          paymentFormDataToSubmit.append("tour", tourId);

          allSubmissions.push(
            paymentMutation.mutateAsync(paymentFormDataToSubmit),
          );
        }
      }

      if (termFormData && hasFormData(termFormData)) {
        const { termData, termFileData } = termFormData;

        const termFileUploadPromises = [];
        const safeTermFileData = Array.isArray(termFileData)
          ? termFileData
          : [termFileData];

        for (let i = 0; i < safeTermFileData.length; i++) {
          const fileData = safeTermFileData[i];
          if (fileData?.file && fileData.file.length > 0) {
            termFileUploadPromises.push(
              uploadFile(
                fileData.file,
                `${fileData.fileTitle || `Terms ${i + 1}`}`,
              ),
            );
          } else {
            termFileUploadPromises.push(Promise.resolve(""));
          }
        }

        const termFileUploadIds = await Promise.all(termFileUploadPromises);
        const safeTermData = Array.isArray(termData) ? termData : [termData];

        for (let i = 0; i < safeTermData.length; i++) {
          const termItem = safeTermData[i];
          const termFormDataToSubmit = new FormData();
          termFormDataToSubmit.append("type", "terms");
          termFormDataToSubmit.append("title", termItem.title);
          termFormDataToSubmit.append("terms", termItem.terms);
          termFormDataToSubmit.append("tour", tourId);

          if (termFileUploadIds[i]) {
            termFormDataToSubmit.append(
              "filesAssociated",
              termFileUploadIds[i],
            );
          }

          allSubmissions.push(termMutation.mutateAsync(termFormDataToSubmit));
        }
      }

      if (documentFormData && hasFormData(documentFormData)) {
        const { documentData, documentFileData } = documentFormData;

        const documentFileUploadPromises = [];
        const safeDocumentFileData = Array.isArray(documentFileData)
          ? documentFileData
          : [documentFileData];

        for (let i = 0; i < safeDocumentFileData.length; i++) {
          const fileData = safeDocumentFileData[i];
          if (fileData?.file && fileData.file.length > 0) {
            documentFileUploadPromises.push(
              uploadFile(
                fileData.file,
                `${fileData.fileTitle || `Document ${i + 1}`}`,
              ),
            );
          } else {
            documentFileUploadPromises.push(Promise.resolve(""));
          }
        }

        const documentFileUploadIds = await Promise.all(
          documentFileUploadPromises,
        );
        const safeDocumentData = Array.isArray(documentData)
          ? documentData
          : [documentData];

        for (let i = 0; i < safeDocumentData.length; i++) {
          const documentItem = safeDocumentData[i];
          const documentFormDataToSubmit = new FormData();
          documentFormDataToSubmit.append("type", "document");
          documentFormDataToSubmit.append("docTitle", documentItem.docTitle);
          documentFormDataToSubmit.append(
            "docDescription",
            documentItem.docDescription,
          );
          documentFormDataToSubmit.append("tour", tourId);

          if (documentFileUploadIds[i]) {
            documentFormDataToSubmit.append(
              "filesAssociated",
              documentFileUploadIds[i],
            );
          }

          allSubmissions.push(
            documentMutation.mutateAsync(documentFormDataToSubmit),
          );
        }
      }

      if (faqFormData && hasFormData(faqFormData)) {
        const safeFaqData = Array.isArray(faqFormData)
          ? faqFormData
          : [faqFormData];

        for (let i = 0; i < safeFaqData.length; i++) {
          const faqItem = safeFaqData[i];

          const faqDataToSubmit: any = {
            type: "faq",
            question: faqItem.question,
            answer: faqItem.answer,
            tour: tourId,
          };

          if (faqItem.formattedLinks && faqItem.formattedLinks.length > 0) {
            faqDataToSubmit.formattedLinks = faqItem.formattedLinks;
          }

          console.log("Submitting FAQ with data:", faqDataToSubmit);

          allSubmissions.push(faqMutation.mutateAsync(faqDataToSubmit));
        }
      }
      await Promise.all(allSubmissions);

      queryClient.invalidateQueries({
        queryKey: ["accommodations"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["cities"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["scopes"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["itineraries"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["pricelists"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["processes"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["payments"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["terms"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["documents"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["tour-files"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["faqs"], exact: false });

      alert("Tour information added successfully!");
      navigate(-2);
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting the forms. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100">
      <FormTabs formType={formType} setFormType={setFormType} />

      <div
        className={`w-full lg:w-2xl ${
          formType === "accommodation" ? "block" : "hidden"
        }`}
      >
        <AccommodationForm ref={accommodationFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${
          formType === "city" ? "block" : "hidden"
        }`}
      >
        <CityForm ref={cityFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${
          formType === "scope" ? "block" : "hidden"
        }`}
      >
        <ScopeForm ref={scopeFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${
          formType === "itinerary" ? "block" : "hidden"
        }`}
      >
        <ItineraryForm ref={itineraryFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${
          formType === "pricelist" ? "block" : "hidden"
        }`}
      >
        <PricelistForm ref={pricelistFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${
          formType === "process" ? "block" : "hidden"
        }`}
      >
        <ProcessForm ref={processFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${
          formType === "payment" ? "block" : "hidden"
        }`}
      >
        <PaymentForm ref={paymentFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${
          formType === "term" ? "block" : "hidden"
        }`}
      >
        <TermForm ref={termFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${
          formType === "document" ? "block" : "hidden"
        }`}
      >
        <DocumentForm ref={documentFormRef} />
      </div>

      <div
        className={`w-full lg:w-2xl ${formType === "faq" ? "block" : "hidden"}`}
      >
        <FaqsForm ref={faqFormRef} />
      </div>

      <div className="w-full lg:w-2xl mt-8">
        <ActionButton
          action={handleFinalSubmit}
          isLoading={isSubmitting}
          title="Add Tour Information"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white text-sm duration-300 w-full"
        />
      </div>
    </div>
  );
};

export default Add;
