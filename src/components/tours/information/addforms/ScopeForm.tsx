import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import {
  addScopeSchema,
  type addScopeData,
} from "../../../../types/scope/addScope";
import InputOption from "../../../input/InputOption";

export interface ScopeFormHandle {
  getFormData: () => Promise<{
    scopeData: addScopeData[];
  } | null>;
}

const hasScopeContent = (scope: {
  scopeCategory?: string;
  scopeType?: string;
  scopeTitle?: string;
  scopeDescription?: string;
}): boolean => {
  return (
    (scope.scopeCategory?.trim() ?? "").length > 0 ||
    (scope.scopeType?.trim() ?? "").length > 0 ||
    (scope.scopeTitle?.trim() ?? "").length > 0 ||
    (scope.scopeDescription?.trim() ?? "").length > 0
  );
};

const scopeSchema = addScopeSchema;

type ScopeSchemaType = z.infer<typeof scopeSchema>;
type FormData = { scopes: ScopeSchemaType[] };

const DEFAULT_SCOPE: ScopeSchemaType = {
  scopeCategory: "",
  scopeType: "",
  scopeTitle: "",
  scopeDescription: "",
};

const ScopeForm = forwardRef<ScopeFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      scopes: [DEFAULT_SCOPE],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "scopes",
  });

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
            scopeType: scope.scopeType,
            scopeTitle: scope.scopeTitle,
            scopeDescription: scope.scopeDescription,
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
      remove(index);
      clearErrors(`scopes.${index}` as any);
    },
    [remove, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, scopeData } = validateAndGetFormData();

      if (!isValid || scopeData.length === 0) {
        return null;
      }

      return { scopeData };
    },
  }));

  const renderScopeForm = (field: { id: string }, index: number) => {
    const currentScope = getValues().scopes[index];
    const hasContent = hasScopeContent(currentScope);
    const typeError = errors.scopes?.[index]?.scopeType?.message;
    const titleError = errors.scopes?.[index]?.scopeTitle?.message;
    const descriptionError = errors.scopes?.[index]?.scopeDescription?.message;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              error={hasContent && typeError ? String(typeError) : ""}
              title="Scope Type"
              placeholder="Enter scope type (e.g., Standard, Premium, Optional)"
              type="text"
              {...register(`scopes.${index}.scopeType` as const)}
            />
          </div>

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
            title="Scope Description"
            placeholder="Enter detailed description of what this scope includes"
            {...register(`scopes.${index}.scopeDescription` as const)}
          />

          <div className="text-xs text-gray-500">
            <p>
              • Scope category defines the main classification
              (Inclusions/Exclusions)
            </p>
            <p>• Scope type indicates the level or tier of the scope</p>
            <p>• Scope title should be clear and descriptive</p>
            <p>• Provide comprehensive details in the description</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="relative w-full flex justify-center">
        <IconButton
          action={addScope}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Scope"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderScopeForm)}</div>
    </div>
  );
});

ScopeForm.displayName = "ScopeForm";

export default ScopeForm;
