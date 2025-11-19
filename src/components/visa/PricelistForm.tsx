import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../types/visafile/addVisaFileTypes";
import {
  addPricelistSchema,
  type addPricelistData,
} from "../../types/pricelist/addPricelistTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import FileInput from "../input/FileInput";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface PricelistFormHandle {
  getFormData: () => Promise<{
    pricelistData: addPricelistData[];
    pricelistFileData: addVisaFileData[];
  } | null>;
}

// Types - Make fileTitle required only when file is present
const pricelistWithFileSchema = addPricelistSchema
  .merge(
    addVisaFileSchema.omit({ file: true, fileTitle: true }).extend({
      file: addVisaFileSchema.shape.file.optional(),
      fileTitle: z.string().optional(),
    })
  )
  .refine(
    (data) => {
      // File title is only required if a file is uploaded
      if (data.file && data.file.length > 0) {
        return !!data.fileTitle?.trim();
      }
      return true;
    },
    {
      message: "File title is required when a file is uploaded",
      path: ["fileTitle"],
    }
  );

type PricelistWithFileData = addPricelistData & {
  fileTitle?: string;
  file?: FileList;
};

const formSchema = z.object({
  pricelists: z.array(pricelistWithFileSchema),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const DEFAULT_PRICELIST: PricelistWithFileData = {
  plan: "",
  fee: "",
  description: "",
  fileTitle: "",
  file: undefined,
};

const PricelistForm = forwardRef<PricelistFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricelists: [DEFAULT_PRICELIST],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricelists",
  });

  const watchPricelists = watch("pricelists");

  // Handlers
  const addPricelist = useCallback(() => {
    append(DEFAULT_PRICELIST);
  }, [append]);

  const removePricelist = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null, index: number) => {
      if (!files || files.length === 0) return;

      setValue(`pricelists.${index}.file`, files);

      // Auto-fill file title if empty
      const currentFileTitle = watchPricelists?.[index]?.fileTitle;
      if (!currentFileTitle) {
        const fileName = files[0].name.split(".").slice(0, -1).join(".");
        setValue(`pricelists.${index}.fileTitle`, fileName);
      }
    },
    [setValue, watchPricelists]
  );

  const handleClearFile = useCallback(
    (index: number) => {
      // Clear both file and file title
      setValue(`pricelists.${index}.file`, undefined);
      setValue(`pricelists.${index}.fileTitle`, "");
    },
    [setValue]
  );

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const isValid = await trigger();
      if (!isValid) return null;

      const formData = getValues();
      const pricelistData: addPricelistData[] = [];
      const pricelistFileData: addVisaFileData[] = [];

      console.log(
        "🔍 PricelistForm - formData.pricelists:",
        formData.pricelists
      );
      console.log(
        "🔍 PricelistForm - isArray:",
        Array.isArray(formData.pricelists)
      );

      // Ensure we're always working with an array
      const pricelistsArray = Array.isArray(formData.pricelists)
        ? formData.pricelists
        : [formData.pricelists];

      pricelistsArray.forEach((pricelist, index) => {
        console.log(`🔍 Processing pricelist ${index}:`, pricelist);

        pricelistData.push({
          plan: pricelist.plan,
          fee: pricelist.fee,
          description: pricelist.description,
        });

        pricelistFileData.push({
          fileTitle: pricelist.fileTitle || "", // Provide empty string if undefined
          file: pricelist.file,
        });
      });

      console.log("🔍 PricelistForm - final pricelistData:", pricelistData);
      console.log(
        "🔍 PricelistForm - final pricelistFileData:",
        pricelistFileData
      );

      return { pricelistData, pricelistFileData };
    },
  }));

  // Render helpers
  const renderFileSection = (index: number) => {
    const currentPricelist = watchPricelists?.[index];
    const hasNewFile = !!currentPricelist?.file;
    const fileName = currentPricelist?.file?.[0]?.name || "";

    return (
      <div className="space-y-4">
        <Input
          disabled={false}
          error={errors.pricelists?.[index]?.fileTitle?.message || ""}
          title="Pricelist File Title"
          placeholder="Enter pricelist file title"
          type="text"
          {...register(`pricelists.${index}.fileTitle`)}
        />

        <FileInput
          title="Upload Pricelist File"
          disabled={false}
          setValue={(fieldName, value) => {
            if (fieldName === "file") {
              setValue(`pricelists.${index}.file`, value as FileList);
            }
          }}
          onChange={(files) => handleFileSelect(files, index)}
          error={
            typeof errors.pricelists?.[index]?.file?.message === "string"
              ? errors.pricelists[index]?.file?.message
              : ""
          }
        />

        {hasNewFile && fileName && (
          <NewFileDisplay
            fileName={fileName}
            onClear={() => handleClearFile(index)}
          />
        )}

        <div className="text-xs text-gray-500">
          <p>• File is optional for each price plan</p>
          <p>• File title is required if you upload a file</p>
          <p>• If you don't enter a file title, the filename will be used</p>
        </div>
      </div>
    );
  };

  const renderPricelistForm = (field: { id: string }, index: number) => {
    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {fields.length > 1 && (
          <IconButton
            action={() => removePricelist(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              disabled={false}
              error={errors.pricelists?.[index]?.plan?.message || ""}
              title="Plan Name"
              placeholder="Enter plan name (e.g., Standard, Express, Premium)"
              type="text"
              {...register(`pricelists.${index}.plan`)}
            />
            <Input
              disabled={false}
              error={errors.pricelists?.[index]?.fee?.message || ""}
              title="Fee Amount"
              placeholder="Enter fee amount"
              type="number"
              {...register(`pricelists.${index}.fee`)}
            />
          </div>

          <TextArea
            disabled={false}
            error={errors.pricelists?.[index]?.description?.message || ""}
            title="Plan Description"
            placeholder="Enter detailed description of what this plan includes"
            {...register(`pricelists.${index}.description`)}
          />

          {renderFileSection(index)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="w-full flex justify-center">
        <IconButton
          action={addPricelist}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Plan"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderPricelistForm)}</div>
    </div>
  );
});

// Sub-component for new file display
interface NewFileDisplayProps {
  fileName: string;
  onClear: () => void;
}

const NewFileDisplay: React.FC<NewFileDisplayProps> = ({
  fileName,
  onClear,
}) => (
  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
    <p className="text-sm text-green-700 font-medium">
      New file selected: {fileName}
    </p>
    <p className="text-xs text-green-600 mt-1">
      This will be uploaded as a new file.
    </p>
    <button
      type="button"
      onClick={onClear}
      className="text-xs text-green-700 hover:text-green-900 underline mt-2"
    >
      Clear selection
    </button>
  </div>
);

PricelistForm.displayName = "PricelistForm";

export default PricelistForm;
