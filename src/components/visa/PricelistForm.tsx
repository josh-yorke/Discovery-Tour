import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef } from "react";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import {
  addPricelistSchema,
  type addPricelistData,
} from "../../types/pricelist/addPricelistTypes";
import Input from "../input/Input";
import FileInput from "../input/FileInput";
import TextArea from "../input/TextArea";

export interface PricelistFormHandle {
  getFormData: () => Promise<{
    pricelistData: addPricelistData;
    pricelistFileData: addVisaFileData;
  } | null>;
}

const PricelistForm = forwardRef<PricelistFormHandle>((_props, ref) => {
  // Pricelist file upload form
  const fileMethods = useForm<addVisaFileData>({
    resolver: zodResolver(addVisaFileSchema),
    defaultValues: {
      fileTitle: "", // Set default as empty string for optional field
    },
  });

  const {
    register: registerFile,
    setValue: setFileValue,
    formState: { errors: fileErrors },
    trigger: triggerFile,
    getValues: getFileValues,
    watch: watchFile,
  } = fileMethods;

  // Pricelist form
  const pricelistMethods = useForm<addPricelistData>({
    resolver: zodResolver(addPricelistSchema),
  });

  const {
    register: registerPricelist,
    formState: { errors: pricelistErrors },
    trigger: triggerPricelist,
    getValues: getPricelistValues,
  } = pricelistMethods;

  const currentFile = watchFile("file");

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async (): Promise<{
      pricelistData: addPricelistData;
      pricelistFileData: addVisaFileData;
    } | null> => {
      const isPricelistValid = await triggerPricelist();

      // For file validation: only require fileTitle if a file is actually selected
      const hasFile = currentFile && currentFile.length > 0;
      let isFileValid = true;

      if (hasFile) {
        // If file is selected, validate both file and fileTitle
        isFileValid = await triggerFile(["fileTitle", "file"]);
      } else {
        // If no file selected, only validate file (fileTitle is optional)
        isFileValid = await triggerFile(["file"]);
      }

      if (!isPricelistValid || !isFileValid) {
        return null;
      }

      const pricelistData = getPricelistValues();
      const pricelistFileData = getFileValues();

      return { pricelistData, pricelistFileData };
    },
  }));

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={pricelistErrors.plan?.message || ""}
            title="Plan"
            placeholder="pricelist plan"
            type="text"
            {...registerPricelist("plan")}
          />
          <Input
            disabled={false}
            error={pricelistErrors.fee?.message || ""}
            title="Fee"
            placeholder="fee"
            type="number"
            {...registerPricelist("fee")}
          />
          <TextArea
            disabled={false}
            error={pricelistErrors.description?.message || ""}
            title="Description"
            placeholder="description"
            {...registerPricelist("description")}
          />

          <Input
            disabled={false}
            error={fileErrors.fileTitle?.message || ""}
            title="Pricelist File Title"
            placeholder="pricelist file title (optional)"
            type="text"
            {...registerFile("fileTitle")}
          />
          <FileInput
            title="Upload Pricelist File"
            disabled={false}
            setValue={setFileValue}
            error={
              typeof fileErrors.file?.message === "string"
                ? fileErrors.file.message
                : ""
            }
          />

          {/* Help text explaining file title is optional */}
          <div className="text-xs text-gray-500">
            <p>
              • File title is optional - if left empty, the filename will be
              used
            </p>
            <p>• File is required if you enter a file title</p>
          </div>
        </div>
      </div>
    </>
  );
});

PricelistForm.displayName = "PricelistForm";

export default PricelistForm;
