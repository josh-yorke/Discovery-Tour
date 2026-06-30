import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { type addVisaFileData } from "../../types/visafile/addVisaFileTypes";
import { type addPricelistData } from "../../types/pricelist/addPricelistTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import InputOption from "../input/InputOption";
import type { editPricelistData } from "../../types/pricelist/pricelistDataTypes";
import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import NumberInput from "../input/NumberInput";

export interface PricelistFormHandle {
  getFormData: () => Promise<{
    pricelistData: addPricelistData[];
    pricelistFileData: addVisaFileData[];
  } | null>;
  removePricelistField: (index: number) => void;
}

interface PricelistFormProps {
  editData?: editPricelistData[];
  fileData?: visaFileData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeletePricelist?: (pricelistId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingPricelist?: boolean;
}

interface BackendPricelistData extends editPricelistData {
  currency?: string;
}

const hasPricelistContent = (pricelist: {
  plan?: string;
  fee?: string;
  description?: string;
  priceCurrency?: string;
  fileTitle?: string;
  file?: FileList;
}): boolean => {
  return (
    (pricelist.plan?.trim() ?? "").length > 0 ||
    (pricelist.fee?.trim() ?? "").length > 0 ||
    (pricelist.description?.trim() ?? "").length > 0 ||
    (pricelist.priceCurrency?.trim() ?? "").length > 0 ||
    (pricelist.fileTitle?.trim() ?? "").length > 0 ||
    (pricelist.file?.length ?? 0) > 0
  );
};

const hasCompletePricelist = (pricelist: {
  plan?: string;
  priceCurrency?: string;
}): boolean => {
  return (
    (pricelist.plan?.trim() ?? "").length > 0 &&
    (pricelist.priceCurrency?.trim() ?? "").length > 0
  );
};

const mergedSchema = z
  .object({
    plan: z.string().min(1, "Plan name is required"),
    fee: z.string().optional().or(z.literal("")),
    description: z.string().optional(),
    priceCurrency: z.string().min(1, "Currency is required"),
    fileTitle: z.string().optional(),
    file: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.file && data.file.length > 0) {
        return !!data.fileTitle?.trim();
      }
      return true;
    },
    {
      message: "File title is required when a file is uploaded",
      path: ["fileTitle"],
    },
  );

type MergedSchemaType = {
  plan: string;
  fee?: string;
  description?: string;
  priceCurrency: string;
  fileTitle?: string;
  file?: FileList;
};

type FormData = { pricelists: MergedSchemaType[] };

const DEFAULT_PRICE_LIST: MergedSchemaType = {
  plan: "",
  fee: "",
  description: "",
  priceCurrency: "",
  fileTitle: "",
  file: undefined,
};

const mapEditDataToDefaultValues = (
  editData: editPricelistData[],
  fileData: visaFileData[],
): MergedSchemaType[] => {
  if (editData.length === 0) return [DEFAULT_PRICE_LIST];

  return editData.map((data, index) => {
    const backendData = data as BackendPricelistData;
    return {
      plan: data?.plan || "",
      fee: data?.fee?.toString() || "",
      description: data?.description || "",
      priceCurrency: backendData.currency || data?.priceCurrency || "USD",
      fileTitle: data?.fileTitle || fileData[index]?.fileTitle || "",
      file: undefined,
    };
  });
};

const EditPricelistForm = forwardRef<PricelistFormHandle, PricelistFormProps>(
  ({ editData = [], fileData = [], onDeletePricelist }, ref) => {
    const {
      register,
      control,
      formState: { errors },
      watch,
      getValues,
      clearErrors,
      setError,
    } = useForm<FormData>({
      mode: "onChange",
      defaultValues: {
        pricelists: mapEditDataToDefaultValues(editData, fileData),
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "pricelists",
    });

    const watchPricelists = watch("pricelists");

    const validateAndGetFormData = useCallback(() => {
      const values = getValues();
      const pricelistData: addPricelistData[] = [];
      const pricelistFileData: addVisaFileData[] = [];
      let isValid = true;

      clearErrors();

      values.pricelists.forEach((pricelist, index) => {
        const hasContent = hasPricelistContent(pricelist);
        const hasFile = (pricelist.file?.length ?? 0) > 0;
        const hasCompleteData = hasCompletePricelist(pricelist);

        if (hasContent) {
          const result = mergedSchema.safeParse(pricelist);

          if (!result.success) {
            isValid = false;
            result.error.issues.forEach((issue) => {
              const path = issue.path[0];
              if (typeof path === "string") {
                setError(`pricelists.${index}.${path}` as any, {
                  type: "manual",
                  message: issue.message,
                });
              }
            });
          }

          if (hasCompleteData) {
            const pricelistItem: addPricelistData = {
              plan: pricelist.plan,
              priceCurrency: pricelist.priceCurrency,
            };

            if (pricelist.description) {
              pricelistItem.description = pricelist.description;
            }

            if (pricelist.fee && pricelist.fee.trim() !== "") {
              pricelistItem.fee = parseFloat(pricelist.fee);
            }

            pricelistData.push(pricelistItem);
            pricelistFileData.push({
              fileTitle: pricelist.fileTitle || "",
              file: pricelist.file,
            });
          } else if (hasContent && !hasCompleteData) {
            isValid = false;
            if (!pricelist.plan?.trim()) {
              setError(`pricelists.${index}.plan` as any, {
                type: "manual",
                message: "Plan name is required",
              });
            }
            if (!pricelist.priceCurrency?.trim()) {
              setError(`pricelists.${index}.priceCurrency` as any, {
                type: "manual",
                message: "Currency is required",
              });
            }
          }

          if (hasFile && !hasCompleteData) {
            isValid = false;
            setError(`pricelists.${index}.plan` as any, {
              type: "manual",
              message: "Complete all required fields before uploading a file",
            });
          }
        }
      });

      return { isValid, pricelistData, pricelistFileData };
    }, [getValues, setError, clearErrors]);

    const addPricelist = useCallback(() => {
      append(DEFAULT_PRICE_LIST);
    }, [append]);

    const removePricelist = useCallback(
      (index: number) => {
        const pricelistItem = editData[index];
        if (pricelistItem?._id && onDeletePricelist) {
          onDeletePricelist(pricelistItem._id, index);
        } else {
          remove(index);
          clearErrors(`pricelists.${index}` as any);
        }
      },
      [remove, editData, onDeletePricelist, clearErrors],
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const { isValid, pricelistData, pricelistFileData } =
          validateAndGetFormData();

        if (!isValid) {
          return null;
        }

        if (pricelistData.length === 0) {
          return { pricelistData: [], pricelistFileData: [] };
        }

        return { pricelistData, pricelistFileData };
      },
      removePricelistField: (index: number) => {
        remove(index);
      },
    }));

    const renderPricelistForm = (field: { id: string }, index: number) => {
      const currentPricelist = watchPricelists?.[index];
      const hasContent = hasPricelistContent(currentPricelist);
      const planError = errors.pricelists?.[index]?.plan?.message;
      const feeError = errors.pricelists?.[index]?.fee?.message;
      const descriptionError = errors.pricelists?.[index]?.description?.message;
      const currencyError = errors.pricelists?.[index]?.priceCurrency?.message;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {fields.length >= 1 && (
            <IconButton
              action={() => removePricelist(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={hasContent && planError ? String(planError) : ""}
              title="Plan Name *"
              placeholder="Enter visa plan name"
              type="text"
              {...register(`pricelists.${index}.plan` as const)}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Displayed Currency *"
              options={["USD", "KRW", "JPY", "PHP"]}
              {...register(`pricelists.${index}.priceCurrency` as const)}
            />
            {hasContent && currencyError && (
              <p className="text-red-500 text-xs mt-1">
                {String(currencyError)}
              </p>
            )}

            <NumberInput
              style="bg-white"
              disabled={false}
              error={hasContent && feeError ? String(feeError) : ""}
              title="Fee Amount"
              placeholder="Enter fee amount (optional)"
              type="text"
              {...register(`pricelists.${index}.fee` as const)}
            />

            <TextArea
              disabled={false}
              error={
                hasContent && descriptionError ? String(descriptionError) : ""
              }
              title="Plan Description"
              placeholder="Enter detailed description of what this plan includes (optional)"
              {...register(`pricelists.${index}.description` as const)}
            />
          </div>
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="w-full flex justify-center">
          <IconButton
            action={addPricelist}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Plan"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderPricelistForm)}
      </div>
    );
  },
);

EditPricelistForm.displayName = "EditPricelistForm";
export default EditPricelistForm;
