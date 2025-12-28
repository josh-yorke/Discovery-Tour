import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import {
  type addScopeData,
  type editScopeData,
} from "../../../../types/scope/addScope";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import InputOption from "../../../input/InputOption";

export interface ScopeFormHandle {
  getFormData: () => Promise<{
    scopeData: addScopeData[];
  } | null>;
  removeScopeField: (index: number) => void;
}

interface ScopeFormProps {
  editData?: editScopeData[];
  onDeleteScope?: (scopeId: string, index: number) => void;
  isDeletingScope?: boolean;
}

// Form schema matching your accommodation form structure
const scopeFormSchema = z.object({
  scopeCategory: z.string().min(1, "Scope category is required"),
  scopeType: z.string().min(1, "Scope type is required"),
  scopeTitle: z.string().min(1, "Scope title is required"),
  scopeDescription: z.string().min(1, "Scope description is required"),
});

type ScopeWithFormData = {
  scopeCategory: string;
  scopeType: string;
  scopeTitle: string;
  scopeDescription: string;
};

// ULTRA STRICT form schema
const formSchema = z.object({
  scopes: z
    .array(scopeFormSchema)
    .min(1, "At least one scope is required")
    .refine(
      (scopes) => {
        // Check that every scope has the required fields
        return scopes.every(
          (scope) =>
            scope.scopeCategory.trim() !== "" &&
            scope.scopeType.trim() !== "" &&
            scope.scopeTitle.trim() !== "" &&
            scope.scopeDescription.trim() !== ""
        );
      },
      {
        message:
          "All scopes must have Category, Type, Title, and Description filled out",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_SCOPE: ScopeWithFormData = {
  scopeCategory: "",
  scopeType: "",
  scopeTitle: "",
  scopeDescription: "",
};

const mapEditDataToDefaultValues = (
  editData: editScopeData[]
): ScopeWithFormData[] => {
  if (editData.length === 0) return [DEFAULT_SCOPE];

  return editData.map((data) => ({
    scopeCategory: data?.scopeCategory || "",
    scopeType: data?.scopeType || "",
    scopeTitle: data?.scopeTitle || "",
    scopeDescription: data?.scopeDescription || "",
  }));
};

const EditScopeForm = forwardRef<ScopeFormHandle, ScopeFormProps>(
  ({ editData = [], onDeleteScope }, ref) => {
    const {
      register,
      control,
      formState: { errors },
      trigger,
      getValues,
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        scopes: mapEditDataToDefaultValues(editData),
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "scopes",
    });

    const addScope = useCallback(() => {
      append(DEFAULT_SCOPE);
    }, [append]);

    const removeScope = useCallback(
      (index: number) => {
        const scopeItem = editData[index];
        if (scopeItem?._id && onDeleteScope) {
          onDeleteScope(scopeItem._id, index);
        } else {
          remove(index);
        }
      },
      [remove, editData, onDeleteScope]
    );

    // ULTRA STRICT getFormData
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        console.log("🔄 Validating scope form...");

        // First validate with Zod
        const isValid = await trigger();
        if (!isValid) {
          console.log("❌ Zod validation failed");
          return null;
        }

        const formData = getValues();
        const scopeData: addScopeData[] = [];

        const scopesArray = Array.isArray(formData.scopes)
          ? formData.scopes
          : [formData.scopes];

        console.log("📋 Raw scopes data:", scopesArray);

        // MANUAL VALIDATION - Check every scope has required data
        for (let i = 0; i < scopesArray.length; i++) {
          const scope = scopesArray[i];

          const hasCategory =
            scope.scopeCategory && scope.scopeCategory.trim() !== "";
          const hasType = scope.scopeType && scope.scopeType.trim() !== "";
          const hasTitle = scope.scopeTitle && scope.scopeTitle.trim() !== "";
          const hasDescription =
            scope.scopeDescription && scope.scopeDescription.trim() !== "";

          console.log(`📝 Scope ${i}:`, {
            hasCategory,
            hasType,
            hasTitle,
            hasDescription,
            category: scope.scopeCategory,
            type: scope.scopeType,
            title: scope.scopeTitle,
          });

          // Only include if ALL required fields are filled
          if (hasCategory && hasType && hasTitle && hasDescription) {
            scopeData.push({
              scopeCategory: scope.scopeCategory,
              scopeType: scope.scopeType,
              scopeTitle: scope.scopeTitle,
              scopeDescription: scope.scopeDescription,
            });
          } else {
            console.log(`⚠️ Skipping scope ${i} - missing required fields`);
          }
        }

        // Final check - must have at least one valid scope
        if (scopeData.length === 0) {
          console.log("❌ No valid scopes found");
          alert(
            "❌ Please fill out all required fields (Category, Type, Title, and Description) for at least one scope."
          );
          return null;
        }

        console.log("✅ Valid scopes:", scopeData.length);
        return { scopeData };
      },
      removeScopeField: (index: number) => {
        remove(index);
      },
    }));

    const renderScopeForm = (field: { id: string }, index: number) => {
      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {/* Delete button */}
          {fields.length >= 1 && (
            <IconButton
              action={() => removeScope(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Scope Category"
                options={["inclusion", "exclusion"]}
                {...register(`scopes.${index}.scopeCategory`)}
              />
              <Input
                style="bg-white"
                disabled={false}
                error={errors.scopes?.[index]?.scopeType?.message || ""}
                title="Scope Type *"
                placeholder="Enter scope type (e.g., Standard, Premium, Optional)"
                type="text"
                {...register(`scopes.${index}.scopeType`)}
              />
            </div>

            <Input
              style="bg-white"
              disabled={false}
              error={errors.scopes?.[index]?.scopeTitle?.message || ""}
              title="Scope Title *"
              placeholder="Enter scope title (e.g., Transportation, Meals, Activities)"
              type="text"
              {...register(`scopes.${index}.scopeTitle`)}
            />

            <TextArea
              disabled={false}
              error={errors.scopes?.[index]?.scopeDescription?.message || ""}
              title="Scope Description *"
              placeholder="Enter detailed description of what this scope includes"
              {...register(`scopes.${index}.scopeDescription`)}
            />

            <div className="text-xs text-gray-500">
              <p>
                • <strong>Scope category</strong> defines the main
                classification (Inclusions/Exclusions/Requirements)
              </p>
              <p>
                • <strong>Scope type</strong> indicates the level or tier of the
                scope
              </p>
              <p>
                • <strong>Scope title</strong> should be clear and descriptive
              </p>
              <p>
                • <strong>Provide comprehensive details</strong> in the
                description
              </p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="w-full flex justify-center">
          <IconButton
            action={addScope}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Scope"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderScopeForm)}
      </div>
    );
  }
);

EditScopeForm.displayName = "EditScopeForm";

export default EditScopeForm;
