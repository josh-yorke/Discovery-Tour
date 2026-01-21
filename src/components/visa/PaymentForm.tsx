import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import {
  addPaymentSchema,
  type addPaymentData,
} from "../../types/payments/addPaymentTypes";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface PaymentFormHandle {
  getFormData: () => Promise<{
    paymentData: addPaymentData[];
  } | null>;
}

const hasPaymentContent = (payment: addPaymentData): boolean => {
  return (
    (payment.paymentType?.trim() ?? "").length > 0 ||
    (payment.currency?.trim() ?? "").length > 0 ||
    (payment.accountName?.trim() ?? "").length > 0 ||
    (payment.bankName?.trim() ?? "").length > 0 ||
    (payment.accountNo?.trim() ?? "").length > 0 ||
    (payment.bankAddress?.trim() ?? "").length > 0 ||
    (payment.swiftCode?.trim() ?? "").length > 0
  );
};

type FormData = { payments: addPaymentData[] };

const DEFAULT_PAYMENT: addPaymentData = {
  paymentType: "",
  currency: "",
  accountName: "",
  bankName: "",
  accountNo: "",
  bankAddress: "",
  swiftCode: "",
};

const PaymentForm = forwardRef<PaymentFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { payments: [DEFAULT_PAYMENT] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const paymentData: addPaymentData[] = [];
    let isValid = true;

    clearErrors();

    values.payments.forEach((payment, index) => {
      const hasContent = hasPaymentContent(payment);

      if (hasContent) {
        const result = addPaymentSchema.safeParse(payment);

        if (!result.success) {
          isValid = false;
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (typeof path === "string") {
              setError(`payments.${index}.${path}` as any, {
                type: "manual",
                message: issue.message,
              });
            }
          });
        } else {
          paymentData.push({
            paymentType: payment.paymentType,
            currency: payment.currency,
            accountName: payment.accountName,
            bankName: payment.bankName,
            accountNo: payment.accountNo,
            bankAddress: payment.bankAddress,
            swiftCode: payment.swiftCode,
          });
        }
      }
    });

    return { isValid, paymentData };
  }, [getValues, setError, clearErrors]);

  const addPayment = useCallback(() => {
    append(DEFAULT_PAYMENT);
  }, [append]);

  const removePayment = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`payments.${index}` as any);
    },
    [remove, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, paymentData } = validateAndGetFormData();

      if (!isValid || paymentData.length === 0) {
        return null;
      }

      return { paymentData };
    },
  }));

  const renderPaymentForm = (field: { id: string }, index: number) => {
    const payment = getValues().payments[index];
    const hasContent = hasPaymentContent(payment);
    const paymentTypeError = errors.payments?.[index]?.paymentType?.message;
    const accountNameError = errors.payments?.[index]?.accountName?.message;
    const bankNameError = errors.payments?.[index]?.bankName?.message;
    const accountNoError = errors.payments?.[index]?.accountNo?.message;
    const swiftCodeError = errors.payments?.[index]?.swiftCode?.message;
    const bankAddressError = errors.payments?.[index]?.bankAddress?.message;

    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {fields.length >= 1 && (
          <IconButton
            action={() => removePayment(index)}
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
              error={
                hasContent && paymentTypeError ? String(paymentTypeError) : ""
              }
              title="Payment Type"
              placeholder="Enter payment type (e.g., Bank Transfer, Credit Card)"
              type="text"
              {...register(`payments.${index}.paymentType` as const)}
            />
            <InputOption
              disabled={false}
              options={["PHP", "KRW", "JPY", "USD"]}
              title="Currency"
              {...register(`payments.${index}.currency` as const)}
              style="bg-white w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasContent && accountNameError ? String(accountNameError) : ""
              }
              title="Account Name"
              placeholder="Enter account holder name"
              type="text"
              {...register(`payments.${index}.accountName` as const)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={hasContent && bankNameError ? String(bankNameError) : ""}
              title="Bank Name"
              placeholder="Enter bank name"
              type="text"
              {...register(`payments.${index}.bankName` as const)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={hasContent && accountNoError ? String(accountNoError) : ""}
              title="Account Number"
              placeholder="Enter account number"
              type="text"
              {...register(`payments.${index}.accountNo` as const)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={hasContent && swiftCodeError ? String(swiftCodeError) : ""}
              title="SWIFT Code"
              placeholder="Enter SWIFT/BIC code"
              type="text"
              {...register(`payments.${index}.swiftCode` as const)}
            />
          </div>

          <Input
            style="bg-white"
            disabled={false}
            error={
              hasContent && bankAddressError ? String(bankAddressError) : ""
            }
            title="Bank Address"
            placeholder="Enter bank branch address"
            type="text"
            {...register(`payments.${index}.bankAddress` as const)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="w-full flex justify-center">
        <IconButton
          action={addPayment}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Payment Method"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderPaymentForm)}</div>
    </div>
  );
});

PaymentForm.displayName = "PaymentForm";
export default PaymentForm;
