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

  // File upload mutation
  const fileMutation = useMutation<string, Error, FormData>({
    mutationFn: addVisaFile,
  });

  // Pricelist mutation
  const pricelistMutation = useMutation<string, Error, FormData>({
    mutationFn: addPriceList,
  });

  // Process mutation
  const processMutation = useMutation<string, Error, FormData>({
    mutationFn: addProcess,
  });

  // Payment mutation
  const paymentMutation = useMutation<string, Error, FormData>({
    mutationFn: addPayment,
  });

  // Term mutation
  const termMutation = useMutation<string, Error, FormData>({
    mutationFn: addTerm,
  });

  // Document mutation
  const documentMutation = useMutation<string, Error, FormData>({
    mutationFn: addDocument,
  });

  // Upload file and return fileId
  const uploadFile = async (
    fileData: File[],
    fileTitle: string
  ): Promise<string> => {
    // Check if fileData exists and has files
    if (!fileData || fileData.length === 0) {
      return ""; // Return empty string if no file
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

  // Helper function to check if form data has content
  const hasFormData = (formData: any): boolean => {
    if (!formData) return false;

    // Check for pricelist data
    if (
      "pricelistData" in formData &&
      Array.isArray(formData.pricelistData) &&
      formData.pricelistData.length > 0
    ) {
      return true;
    }
    // Check for process data
    if (
      "processData" in formData &&
      Array.isArray(formData.processData) &&
      formData.processData.length > 0
    ) {
      return true;
    }
    // Check for payment data
    if (
      "paymentData" in formData &&
      Array.isArray(formData.paymentData) &&
      formData.paymentData.length > 0
    ) {
      return true;
    }
    // Check for term data
    if (
      "termData" in formData &&
      Array.isArray(formData.termData) &&
      formData.termData.length > 0
    ) {
      return true;
    }
    // Check for document data
    if (
      "documentData" in formData &&
      Array.isArray(formData.documentData) &&
      formData.documentData.length > 0
    ) {
      return true;
    }

    return false;
  };

  // Handle final submission of all forms with file uploads
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const visaId = localStorage.getItem("visaId") || "";

      if (!visaId) {
        alert("Please select a visa first.");
        setIsSubmitting(false);
        return;
      }

      // Get form data from all forms using refs - these can be null/undefined if forms are empty
      const pricelistFormData = await pricelistFormRef.current?.getFormData();
      const processFormData = await processFormRef.current?.getFormData();
      const paymentFormData = await paymentFormRef.current?.getFormData();
      const termFormData = await termFormRef.current?.getFormData();
      const documentFormData = await documentFormRef.current?.getFormData();

      // Check if ALL forms are empty
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

      // Prepare submissions for each form type only if they have data
      const allSubmissions = [];

      // Handle pricelist submissions if data exists
      if (pricelistFormData && hasFormData(pricelistFormData)) {
        const { pricelistData, pricelistFileData } = pricelistFormData;

        console.log("Uploading pricelist files...");

        // Handle multiple pricelist file uploads
        const pricelistFileUploadPromises = [];

        // Ensure pricelistFileData is an array
        const safePricelistFileData = Array.isArray(pricelistFileData)
          ? pricelistFileData
          : [pricelistFileData];

        // Upload files for each pricelist entry
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

        console.log("Pricelist files uploaded:", pricelistFileUploadIds);

        // Submit multiple pricelists
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

      // Handle process submissions if data exists
      if (processFormData && hasFormData(processFormData)) {
        const { processData, processFileData } = processFormData;

        console.log("Uploading process files...");

        // Process file upload
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

        console.log("Process files uploaded:", processFileUploadIds);

        // Submit multiple processes
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

      // Handle payment submissions if data exists
      if (paymentFormData && hasFormData(paymentFormData)) {
        const { paymentData } = paymentFormData;

        console.log("Submitting payment methods...");

        // Submit multiple payments
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
          // No filesAssociated for payment

          allSubmissions.push(
            paymentMutation.mutateAsync(paymentFormDataToSubmit)
          );
        }
      }

      // Handle term submissions if data exists
      if (termFormData && hasFormData(termFormData)) {
        const { termData, termFileData } = termFormData;

        console.log("Uploading term files...");

        // Term file upload
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

        console.log("Term files uploaded:", termFileUploadIds);

        // Submit multiple terms
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

      // Handle document submissions if data exists
      if (documentFormData && hasFormData(documentFormData)) {
        const { documentData, documentFileData } = documentFormData;

        console.log("Uploading document files...");

        // Document file upload
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

        console.log("Document files uploaded:", documentFileUploadIds);

        // Submit multiple documents
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

      console.log("Submitting forms...");

      // Execute only the mutations that have data
      await Promise.all(allSubmissions);

      console.log("All submissions completed successfully");

      // Invalidate queries and navigate on success
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
    <div className="w-full min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100">
      <FormTabs formType={formType} setFormType={setFormType} />

      {/* Pricelist Section */}
      <div
        className={`w-full lg:w-2xl ${
          formType === "pricelist" ? "block" : "hidden"
        }`}
      >
        <PricelistForm ref={pricelistFormRef} />
      </div>

      {/* Process Section */}
      <div
        className={`w-full lg:w-2xl ${
          formType === "process" ? "block" : "hidden"
        }`}
      >
        <ProcessForm ref={processFormRef} />
      </div>

      {/* Payment Section */}
      <div
        className={`w-full lg:w-2xl ${
          formType === "payment" ? "block" : "hidden"
        }`}
      >
        <PaymentForm ref={paymentFormRef} />
      </div>

      {/* Term Section */}
      <div
        className={`w-full lg:w-2xl ${
          formType === "term" ? "block" : "hidden"
        }`}
      >
        <TermForm ref={termFormRef} />
      </div>

      {/* Document Section */}
      <div
        className={`w-full lg:w-2xl ${
          formType === "document" ? "block" : "hidden"
        }`}
      >
        <DocumentForm ref={documentFormRef} />
      </div>

      {/* Single Submit Button */}
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
