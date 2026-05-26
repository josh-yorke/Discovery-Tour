import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../hooks/auth/useLogin";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import { useNavigate, Link } from "react-router";
import { RiMailLine, RiArrowLeftLine, RiSendPlaneLine } from "react-icons/ri";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      setMessage(data);
      reset();
    },
    onError: (error: any) => setMessage(error.message),
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data.email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white px-6 py-4 shadow-lg">
            <img
              src={"/Logo.jpeg"}
              alt="Logo"
              className="w-26 object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Header */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-[#1d2087] hover:text-[#393ca3] transition duration-150 ease-in-out"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiMailLine className="text-gray-400" size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-[#1d2087] sm:text-sm transition duration-150 ease-in-out`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {message && !mutation.isSuccess && (
              <div className="rounded-xl bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-700">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-linear-to-br from-[#1d2087] to-[#393ca3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d2087] disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out hover:scale-[1.02]"
              >
                {mutation.isPending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <RiSendPlaneLine size={16} />
                    Send reset link
                  </>
                )}
              </button>
            </div>

            {/* Back to Login Link */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1d2087] hover:text-[#393ca3] transition duration-150 ease-in-out"
              >
                <RiArrowLeftLine size={16} />
                Back to sign in
              </Link>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Check your spam folder if you don't receive the email within a
                few minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {message && mutation.isSuccess && (
        <Modal
          message={message}
          success={mutation.isSuccess}
          action={() => {
            setMessage(null);
            if (mutation.isSuccess) {
              navigate("/login");
            }
          }}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
