import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { addPriceList } from "../../../../hooks/visa/pricelist/addPriceList";
import { addProcess } from "../../../../hooks/visa/process/addProcess";
import { addPayment } from "../../../../hooks/visa/payment/addPayment";
import { addTerm } from "../../../../hooks/visa/terms/addTerm";
import { addDocument } from "../../../../hooks/visa/document/addDocument";
import { addVisaFile } from "../../../../hooks/visa/file/addVisaFile";
import ActionButton from "../../../button/ActionButton";
import type { PricelistFormHandle } from "../../PricelistForm";
import type { ProcessFormHandle } from "../../ProcessForm";
import type { PaymentFormHandle } from "../../PaymentForm";
import FormTabs from "./FormTab";
import PricelistForm from "../../PricelistForm";
import ProcessForm from "../../ProcessForm";
import PaymentForm from "../../PaymentForm";
import TermForm, { type TermFormHandle } from "../../TermForm";
import DocumentForm, { type DocumentFormHandle } from "../../DocumentForm";

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
    fileTitle: string
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
      const visaId = localStorage.getItem("visaId") || "";

      if (!visaId) {
        alert("Please select a visa first.");
        setIsSubmitting(false);
        return;
      }

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
                `${fileData.fileTitle || `Pricelist ${i + 1}`}`
              )
            );
          } else {
            pricelistFileUploadPromises.push(Promise.resolve(""));
          }
        }

        const pricelistFileUploadIds = await Promise.all(
          pricelistFileUploadPromises
        );
        const safePricelistData = Array.isArray(pricelistData)
          ? pricelistData
          : [pricelistData];

        for (let i = 0; i < safePricelistData.length; i++) {
          const pricelistItem = safePricelistData[i];
          const pricelistFormDataToSubmit = new FormData();
          pricelistFormDataToSubmit.append("type", "price");
          pricelistFormDataToSubmit.append("plan", pricelistItem.plan);
          pricelistFormDataToSubmit.append("fee", pricelistItem.fee);
          pricelistFormDataToSubmit.append(
            "description",
            pricelistItem.description
          );
          pricelistFormDataToSubmit.append("visa", visaId);

          if (pricelistFileUploadIds[i]) {
            pricelistFormDataToSubmit.append(
              "filesAssociated",
              pricelistFileUploadIds[i]
            );
          }

          allSubmissions.push(
            pricelistMutation.mutateAsync(pricelistFormDataToSubmit)
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
                `${fileData.fileTitle || `Process ${i + 1}`}`
              )
            );
          } else {
            processFileUploadPromises.push(Promise.resolve(""));
          }
        }

        const processFileUploadIds = await Promise.all(
          processFileUploadPromises
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
            processItem.processTitle
          );
          processFormDataToSubmit.append("process", processItem.process);
          processFormDataToSubmit.append("visa", visaId);

          if (processFileUploadIds[i]) {
            processFormDataToSubmit.append(
              "filesAssociated",
              processFileUploadIds[i]
            );
          }

          allSubmissions.push(
            processMutation.mutateAsync(processFormDataToSubmit)
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
            paymentItem.paymentType
          );
          paymentFormDataToSubmit.append("currency", paymentItem.currency);
          paymentFormDataToSubmit.append(
            "accountName",
            paymentItem.accountName
          );
          paymentFormDataToSubmit.append("bankName", paymentItem.bankName);
          paymentFormDataToSubmit.append("accountNo", paymentItem.accountNo);
          paymentFormDataToSubmit.append(
            "bankAddress",
            paymentItem.bankAddress
          );
          paymentFormDataToSubmit.append("swiftCode", paymentItem.swiftCode);
          paymentFormDataToSubmit.append("visa", visaId);

          allSubmissions.push(
            paymentMutation.mutateAsync(paymentFormDataToSubmit)
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
                `${fileData.fileTitle || `Terms ${i + 1}`}`
              )
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
          termFormDataToSubmit.append("visa", visaId);

          if (termFileUploadIds[i]) {
            termFormDataToSubmit.append(
              "filesAssociated",
              termFileUploadIds[i]
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
                `${fileData.fileTitle || `Document ${i + 1}`}`
              )
            );
          } else {
            documentFileUploadPromises.push(Promise.resolve(""));
          }
        }

        const documentFileUploadIds = await Promise.all(
          documentFileUploadPromises
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
            documentItem.docDescription
          );
          documentFormDataToSubmit.append("visa", visaId);

          if (documentFileUploadIds[i]) {
            documentFormDataToSubmit.append(
              "filesAssociated",
              documentFileUploadIds[i]
            );
          }

          allSubmissions.push(
            documentMutation.mutateAsync(documentFormDataToSubmit)
          );
        }
      }

      await Promise.all(allSubmissions);

      queryClient.invalidateQueries({ queryKey: ["pricelist"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["process"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["payment"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["term"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["document"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["files"], exact: false });

      alert("Visa information added successfully!");
      navigate("/visas/visa");
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
          title="Add Visa Information"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white text-sm duration-300 w-full"
        />
      </div>
    </div>
  );
};

export default Add;
