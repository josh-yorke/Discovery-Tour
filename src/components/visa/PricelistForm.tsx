import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { type addVisaFileData } from "../../types/visafile/addVisaFileTypes";
import { type addPricelistData } from "../../types/pricelist/addPricelistTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import NumberInput from "../input/NumberInput";
import InputOption from "../input/InputOption";

export interface PricelistFormHandle {
  getFormData: () => Promise<{
    pricelistData: addPricelistData[];
    pricelistFileData: addVisaFileData[];
  } | null>;
}

const hasPricelistContent = (pricelist: {
  plan?: string;
  fee?: string | number;
  description?: string;
  fileTitle?: string;
  file?: FileList;
  priceCurrency?: string;
}): boolean => {
  return (
    (pricelist.plan?.trim() ?? "").length > 0 ||
    (typeof pricelist.fee === "string" && pricelist.fee.trim() !== "") ||
    (typeof pricelist.fee === "number" && !isNaN(pricelist.fee)) ||
    (pricelist.description?.trim() ?? "").length > 0 ||
    (pricelist.priceCurrency?.trim() ?? "").length > 0 ||
    (pricelist.fileTitle?.trim() ?? "").length > 0 ||
    (pricelist.file?.length ?? 0) > 0
  );
};

const mergedSchema = z
  .object({
    plan: z.string().min(1, "Plan name is required"),
    fee: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        if (typeof val === "string") return parseFloat(val);
        return val;
      }),
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
  fee?: string | number;
  description?: string;
  priceCurrency: string;
  fileTitle?: string;
  file?: FileList;
};

type FormData = { pricelists: MergedSchemaType[] };

const DEFAULT_PRICELIST: MergedSchemaType = {
  plan: "",
  fee: "",
  description: "",
  priceCurrency: "",
  fileTitle: "",
  file: undefined,
};

const PricelistForm = forwardRef<PricelistFormHandle>((_props, ref) => {
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
    defaultValues: { pricelists: [DEFAULT_PRICELIST] },
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
        } else {
          const pricelistItem: addPricelistData = {
            plan: result.data.plan,
            description: result.data.description || "",
            priceCurrency: result.data.priceCurrency,
          };

          if (result.data.fee !== undefined) {
            pricelistItem.fee = result.data.fee;
          }

          pricelistData.push(pricelistItem);
          pricelistFileData.push({
            fileTitle: pricelist.fileTitle || "",
            file: pricelist.file,
          });
        }
      }
    });

    return { isValid, pricelistData, pricelistFileData };
  }, [getValues, setError, clearErrors]);

  const addPricelist = useCallback(() => {
    append(DEFAULT_PRICELIST);
  }, [append]);

  const removePricelist = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`pricelists.${index}` as any);
    },
    [remove, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, pricelistData, pricelistFileData } =
        validateAndGetFormData();

      if (!isValid || pricelistData.length === 0) {
        return null;
      }

      return { pricelistData, pricelistFileData };
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={hasContent && planError ? String(planError) : ""}
              title="Plan Name *"
              placeholder="Enter plan name (e.g., Standard, Express, Premium)"
              type="text"
              {...register(`pricelists.${index}.plan` as const)}
            />
            <div>
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
            </div>
            <NumberInput
              style="bg-white"
              disabled={false}
              error={hasContent && feeError ? String(feeError) : ""}
              title="Fee Amount"
              placeholder="Enter fee amount (optional)"
              type="number"
              {...register(`pricelists.${index}.fee` as const)}
            />
          </div>

          <TextArea
            disabled={false}
            error={
              hasContent && descriptionError ? String(descriptionError) : ""
            }
            title="Plan Description"
            placeholder="Enter detailed description of what this plan includes (optional)"
            {...register(`pricelists.${index}.description` as const)}
          />

          <div className="text-xs text-gray-500">
            <p>• Fields marked with * are required</p>
            <p>• Fee amount and description are optional</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="relative w-full flex justify-center">
        <IconButton
          action={addPricelist}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Plan"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderPricelistForm)}</div>
    </div>
  );
});

PricelistForm.displayName = "PricelistForm";
export default PricelistForm;
