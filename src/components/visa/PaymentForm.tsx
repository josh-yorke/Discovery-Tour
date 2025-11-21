import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
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

const formSchema = z.object({
  payments: z.array(addPaymentSchema),
});

type FormData = z.infer<typeof formSchema>;

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
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payments: [DEFAULT_PAYMENT],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  const addPayment = useCallback(() => {
    append(DEFAULT_PAYMENT);
  }, [append]);

  // UPDATED: Allow deletion even when there's only one payment, no auto-add
  const removePayment = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const isValid = await trigger();
      if (!isValid) return null;

      const formData = getValues();
      const paymentData: addPaymentData[] = [];

      const paymentsArray = Array.isArray(formData.payments)
        ? formData.payments
        : [formData.payments];

      paymentsArray.forEach((payment) => {
        paymentData.push({
          paymentType: payment.paymentType,
          currency: payment.currency,
          accountName: payment.accountName,
          bankName: payment.bankName,
          accountNo: payment.accountNo,
          bankAddress: payment.bankAddress,
          swiftCode: payment.swiftCode,
        });
      });

      return { paymentData };
    },
  }));

  const renderPaymentForm = (field: { id: string }, index: number) => {
    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {/* UPDATED: Always show delete button when there's at least one payment */}
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
              error={errors.payments?.[index]?.paymentType?.message || ""}
              title="Payment Type"
              placeholder="Enter payment type (e.g., Bank Transfer, Credit Card)"
              type="text"
              {...register(`payments.${index}.paymentType`)}
            />
            <InputOption
              disabled={false}
              options={["PHP", "KRW", "JPY", "USD"]}
              title="Currency"
              {...register(`payments.${index}.currency`)}
              style="bg-white w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.payments?.[index]?.accountName?.message || ""}
              title="Account Name"
              placeholder="Enter account holder name"
              type="text"
              {...register(`payments.${index}.accountName`)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={errors.payments?.[index]?.bankName?.message || ""}
              title="Bank Name"
              placeholder="Enter bank name"
              type="text"
              {...register(`payments.${index}.bankName`)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.payments?.[index]?.accountNo?.message || ""}
              title="Account Number"
              placeholder="Enter account number"
              type="text"
              {...register(`payments.${index}.accountNo`)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={errors.payments?.[index]?.swiftCode?.message || ""}
              title="SWIFT Code"
              placeholder="Enter SWIFT/BIC code"
              type="text"
              {...register(`payments.${index}.swiftCode`)}
            />
          </div>

          <Input
            style="bg-white"
            disabled={false}
            error={errors.payments?.[index]?.bankAddress?.message || ""}
            title="Bank Address"
            placeholder="Enter bank branch address"
            type="text"
            {...register(`payments.${index}.bankAddress`)}
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
