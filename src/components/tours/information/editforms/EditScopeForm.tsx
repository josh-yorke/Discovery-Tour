import { useForm, useFieldArray } from "react-hook-form";
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

const hasScopeContent = (scope: {
  scopeCategory?: string;
  scopeTitle?: string;
  scopeDescription?: string;
}): boolean => {
  return (
    (scope.scopeCategory?.trim() ?? "").length > 0 ||
    (scope.scopeTitle?.trim() ?? "").length > 0 ||
    (scope.scopeDescription?.trim() ?? "").length > 0
  );
};

const scopeSchema = z.object({
  scopeCategory: z.string().min(1, "Scope category is required"),
  scopeTitle: z.string().min(1, "Scope title is required"),
  scopeDescription: z.string().optional(),
});

type ScopeSchemaType = {
  scopeCategory: string;
  scopeTitle: string;
  scopeDescription?: string;
};

type FormData = { scopes: ScopeSchemaType[] };

const DEFAULT_SCOPE: ScopeSchemaType = {
  scopeCategory: "",
  scopeTitle: "",
  scopeDescription: "",
};

const mapEditDataToDefaultValues = (
  editData: editScopeData[],
): ScopeSchemaType[] => {
  if (editData.length === 0) return [DEFAULT_SCOPE];

  return editData.map((data) => ({
    scopeCategory: data?.scopeCategory || "",
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
      watch,
      getValues,
      clearErrors,
      setError,
    } = useForm<FormData>({
      mode: "onChange",
      defaultValues: {
        scopes: mapEditDataToDefaultValues(editData),
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "scopes",
    });

    const watchScopes = watch("scopes");

    const validateAndGetFormData = useCallback(() => {
      const values = getValues();
      const scopeData: addScopeData[] = [];
      let isValid = true;

      clearErrors();

      values.scopes.forEach((scope, index) => {
        const hasContent = hasScopeContent(scope);

        if (hasContent) {
          const result = scopeSchema.safeParse(scope);

          if (!result.success) {
            isValid = false;
            result.error.issues.forEach((issue) => {
              const path = issue.path[0];
              if (typeof path === "string") {
                setError(`scopes.${index}.${path}` as any, {
                  type: "manual",
                  message: issue.message,
                });
              }
            });
          } else {
            scopeData.push({
              scopeCategory: scope.scopeCategory,
              scopeTitle: scope.scopeTitle,
              scopeDescription: scope.scopeDescription || "",
            });
          }
        }
      });

      return { isValid, scopeData };
    }, [getValues, setError, clearErrors]);

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
          clearErrors(`scopes.${index}` as any);
        }
      },
      [remove, editData, onDeleteScope, clearErrors],
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const { isValid, scopeData } = validateAndGetFormData();

        if (!isValid || scopeData.length === 0) {
          return null;
        }

        return { scopeData };
      },
      removeScopeField: (index: number) => {
        remove(index);
      },
    }));

    const renderScopeForm = (field: { id: string }, index: number) => {
      const currentScope = watchScopes?.[index];
      const hasContent = hasScopeContent(currentScope);
      const titleError = errors.scopes?.[index]?.scopeTitle?.message;
      const descriptionError =
        errors.scopes?.[index]?.scopeDescription?.message;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {fields.length >= 1 && (
            <IconButton
              action={() => removeScope(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Scope Category"
              options={["inclusion", "exclusion"]}
              {...register(`scopes.${index}.scopeCategory` as const)}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={hasContent && titleError ? String(titleError) : ""}
              title="Scope Title"
              placeholder="Enter scope title (e.g., Transportation, Meals, Activities)"
              type="text"
              {...register(`scopes.${index}.scopeTitle` as const)}
            />

            <TextArea
              disabled={false}
              error={
                hasContent && descriptionError ? String(descriptionError) : ""
              }
              title="Scope Description (Optional)"
              placeholder="Enter detailed description of what this scope includes (optional)"
              {...register(`scopes.${index}.scopeDescription` as const)}
            />

            <div className="text-xs text-gray-500">
              <p>
                • Scope category defines the main classification
                (Inclusions/Exclusions)
              </p>
              <p>• Scope title should be clear and descriptive</p>
              <p>• Description is optional but recommended for clarity</p>
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
  },
);

EditScopeForm.displayName = "EditScopeForm";

export default EditScopeForm;
