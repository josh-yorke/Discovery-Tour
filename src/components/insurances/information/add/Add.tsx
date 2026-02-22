import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import type { PricelistFormHandle } from "../../../visa/PricelistForm";
import type { ProcessFormHandle } from "../../../visa/ProcessForm";
import type { PaymentFormHandle } from "../../../visa/PaymentForm";
import type { TermFormHandle } from "../../../visa/TermForm";
import type { DocumentFormHandle } from "../../../visa/DocumentForm";
import { addVisaFile } from "../../../../hooks/visa/file/addVisaFile";
import { addPriceList } from "../../../../hooks/visa/pricelist/addPriceList";
import { addProcess } from "../../../../hooks/visa/process/addProcess";
import { addPayment } from "../../../../hooks/visa/payment/addPayment";
import { addTerm } from "../../../../hooks/visa/terms/addTerm";
import { addDocument } from "../../../../hooks/visa/document/addDocument";
import FormTabs from "../../../visa/information/add/FormTab";
import PricelistForm from "../../../visa/PricelistForm";
import ProcessForm from "../../../visa/ProcessForm";
import PaymentForm from "../../../visa/PaymentForm";
import TermForm from "../../../visa/TermForm";
import DocumentForm from "../../../visa/DocumentForm";
import ActionButton from "../../../button/ActionButton";

export type FormType =
  | "pricelist"
  | "process"
  | "payment"
  | "term"
  | "document";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formType, setFormType] = useState<FormType>("pricelist");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricelistFormRef = useRef<PricelistFormHandle>(null);
  const processFormRef = useRef<ProcessFormHandle>(null);
  const paymentFormRef = useRef<PaymentFormHandle>(null);
  const termFormRef = useRef<TermFormHandle>(null);
  const documentFormRef = useRef<DocumentFormHandle>(null);

  const fileMutation = useMutation<string, Error, FormData>({
    mutationFn: addVisaFile,
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

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const insuranceId = localStorage.getItem("insuranceId") || "";

      if (!insuranceId) {
        alert("Please select an insurance policy first.");
        setIsSubmitting(false);
        return;
      }

      console.log(insuranceId);

      const pricelistFormData = await pricelistFormRef.current?.getFormData();
      const processFormData = await processFormRef.current?.getFormData();
      const paymentFormData = await paymentFormRef.current?.getFormData();
      const termFormData = await termFormRef.current?.getFormData();
      const documentFormData = await documentFormRef.current?.getFormData();

      const allFormsEmpty = [
        pricelistFormData,
        processFormData,
        paymentFormData,
        termFormData,
        documentFormData,
      ].every((formData) => !hasFormData(formData));

      if (allFormsEmpty) {
        alert("Please fill at least one form before submitting.");
        setIsSubmitting(false);
        return;
      }

      const allSubmissions = [];

      // Pricelist Form Submission
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
          if (pricelistItem.fee !== undefined && pricelistItem.fee !== null) {
            pricelistFormDataToSubmit.append(
              "fee",
              pricelistItem.fee.toString(),
            );
          }
          pricelistFormDataToSubmit.append(
            "priceCurrency",
            pricelistItem.priceCurrency,
          );
          pricelistFormDataToSubmit.append(
            "description",
            pricelistItem.description,
          );
          pricelistFormDataToSubmit.append("insurance", insuranceId);

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

      // Process Form Submission
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
          processFormDataToSubmit.append("insurance", insuranceId);

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

      // Payment Form Submission
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
          paymentFormDataToSubmit.append("insurance", insuranceId);

          allSubmissions.push(
            paymentMutation.mutateAsync(paymentFormDataToSubmit),
          );
        }
      }

      // Term Form Submission
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
          termFormDataToSubmit.append("insurance", insuranceId);

          if (termFileUploadIds[i]) {
            termFormDataToSubmit.append(
              "filesAssociated",
              termFileUploadIds[i],
            );
          }

          allSubmissions.push(termMutation.mutateAsync(termFormDataToSubmit));
        }
      }

      // Document Form Submission
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
          documentFormDataToSubmit.append("insurance", insuranceId);

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

      await Promise.all(allSubmissions);

      // Invalidate all relevant queries
      queryClient.invalidateQueries({
        queryKey: ["insurance-pricelist"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["insurance-process"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["insurance-payment"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["insurance-term"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["insurance-document"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["insurance-files"],
        exact: false,
      });

      alert("Insurance information added successfully!");
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

      <div className="w-full lg:w-2xl mt-8">
        <ActionButton
          action={handleFinalSubmit}
          isLoading={isSubmitting}
          title="Add Insurance Information"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white text-sm duration-300 w-full"
        />
      </div>
    </div>
  );
};

export default Add;
