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
import TermForm, { type termFormHandle } from "../../TermForm";
import DocumentForm, { type documentFormHandle } from "../../DocumentForm";

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
  const termFormRef = useRef<termFormHandle>(null);
  const documentFormRef = useRef<documentFormHandle>(null);

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
      const { paymentData } = paymentFormData; // Payment form doesn't have file data
      const { termData, termFileData } = termFormData;
      const { documentData, documentFileData } = documentFormData;

      console.log("Uploading files...");

      // Upload files first and get their IDs (skip payment since it doesn't have files)
      const fileUploadPromises = [];

      // Pricelist file upload
      if (pricelistFileData.file && pricelistFileData.file.length > 0) {
        fileUploadPromises.push(
          uploadFile(
            pricelistFileData.file,
            `Pricelist - ${pricelistFileData.fileTitle || "Pricelist"}`
          )
        );
      } else {
        fileUploadPromises.push(Promise.resolve(""));
      }

      // Process file upload
      if (processFileData.file && processFileData.file.length > 0) {
        fileUploadPromises.push(
          uploadFile(
            processFileData.file,
            `Process - ${processFileData.fileTitle || "Process"}`
          )
        );
      } else {
        fileUploadPromises.push(Promise.resolve(""));
      }

      // Payment file upload - skip since payment doesn't have files
      fileUploadPromises.push(Promise.resolve(""));

      // Term file upload
      if (termFileData.file && termFileData.file.length > 0) {
        fileUploadPromises.push(
          uploadFile(
            termFileData.file,
            `Term - ${termFileData.fileTitle || "Terms"}`
          )
        );
      } else {
        fileUploadPromises.push(Promise.resolve(""));
      }

      // Document file upload
      if (documentFileData.file && documentFileData.file.length > 0) {
        fileUploadPromises.push(
          uploadFile(
            documentFileData.file,
            `Document - ${documentFileData.fileTitle || "Document"}`
          )
        );
      } else {
        fileUploadPromises.push(Promise.resolve(""));
      }

      const [
        pricelistFileUploadId,
        processFileUploadId,
        paymentFileUploadId,
        termFileUploadId,
        documentFileUploadId,
      ] = await Promise.all(fileUploadPromises);

      console.log("Files uploaded:", {
        pricelistFileId: pricelistFileUploadId,
        processFileId: processFileUploadId,
        paymentFileId: paymentFileUploadId,
        termFileId: termFileUploadId,
        documentFileId: documentFileUploadId,
      });

      // Submit pricelist with file ID (only if file exists)
      const pricelistFormDataToSubmit = new FormData();
      pricelistFormDataToSubmit.append("type", "price");
      pricelistFormDataToSubmit.append("plan", pricelistData.plan);
      pricelistFormDataToSubmit.append("fee", pricelistData.fee);
      pricelistFormDataToSubmit.append(
        "description",
        pricelistData.description
      );
      pricelistFormDataToSubmit.append("visa", visaId);
      if (pricelistFileUploadId) {
        pricelistFormDataToSubmit.append(
          "filesAssociated",
          pricelistFileUploadId
        );
      }

      // Submit process with file ID (only if file exists)
      const processFormDataToSubmit = new FormData();
      processFormDataToSubmit.append("type", "process");
      processFormDataToSubmit.append("processTitle", processData.processTitle);
      processFormDataToSubmit.append("process", processData.process);
      processFormDataToSubmit.append("visa", visaId);
      if (processFileUploadId) {
        processFormDataToSubmit.append("filesAssociated", processFileUploadId);
      }

      // Submit payment (no file)
      const paymentFormDataToSubmit = new FormData();
      paymentFormDataToSubmit.append("type", "payment");
      paymentFormDataToSubmit.append("paymentType", paymentData.paymentType);
      paymentFormDataToSubmit.append("currency", paymentData.currency);
      paymentFormDataToSubmit.append("accountName", paymentData.accountName);
      paymentFormDataToSubmit.append("bankName", paymentData.bankName);
      paymentFormDataToSubmit.append("accountNo", paymentData.accountNo);
      paymentFormDataToSubmit.append("bankAddress", paymentData.bankAddress);
      paymentFormDataToSubmit.append("swiftCode", paymentData.swiftCode);
      paymentFormDataToSubmit.append("visa", visaId);
      // No filesAssociated for payment

      // Submit term with file ID (only if file exists)
      const termFormDataToSubmit = new FormData();
      termFormDataToSubmit.append("type", "terms");
      termFormDataToSubmit.append("title", termData.title);
      termFormDataToSubmit.append("terms", termData.terms);
      termFormDataToSubmit.append("visa", visaId);
      if (termFileUploadId) {
        termFormDataToSubmit.append("filesAssociated", termFileUploadId);
      }

      // Submit document with file ID (only if file exists)
      const documentFormDataToSubmit = new FormData();
      documentFormDataToSubmit.append("type", "document");
      documentFormDataToSubmit.append("docTitle", documentData.docTitle);
      documentFormDataToSubmit.append(
        "docDescription",
        documentData.docDescription
      );
      documentFormDataToSubmit.append("visa", visaId);
      if (documentFileUploadId) {
        documentFormDataToSubmit.append(
          "filesAssociated",
          documentFileUploadId
        );
      }

      console.log("Submitting all forms...");

      // Execute all mutations
      await Promise.all([
        pricelistMutation.mutateAsync(pricelistFormDataToSubmit),
        processMutation.mutateAsync(processFormDataToSubmit),
        paymentMutation.mutateAsync(paymentFormDataToSubmit),
        termMutation.mutateAsync(termFormDataToSubmit),
        documentMutation.mutateAsync(documentFormDataToSubmit),
      ]);

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
        className={`w-full ${formType === "pricelist" ? "block" : "hidden"}`}
      >
        <PricelistForm ref={pricelistFormRef} />
      </div>

      {/* Process Section */}
      <div className={`w-full ${formType === "process" ? "block" : "hidden"}`}>
        <ProcessForm ref={processFormRef} />
      </div>

      {/* Payment Section */}
      <div className={`w-full ${formType === "payment" ? "block" : "hidden"}`}>
        <PaymentForm ref={paymentFormRef} />
      </div>

      {/* Term Section */}
      <div className={`w-full ${formType === "term" ? "block" : "hidden"}`}>
        <TermForm ref={termFormRef} />
      </div>

      {/* Document Section */}
      <div className={`w-full ${formType === "document" ? "block" : "hidden"}`}>
        <DocumentForm ref={documentFormRef} />
      </div>

      {/* Single Submit Button */}
      <div className="w-full mt-8">
        <ActionButton
          action={handleFinalSubmit}
          isLoading={isSubmitting}
          title="Save Visa Information"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 w-full"
        />
      </div>
    </div>
  );
};

export default Add;
