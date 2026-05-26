import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  RiLockLine,
  RiEyeLine,
  RiEyeCloseLine,
  RiCheckLine,
} from "react-icons/ri";
import { verifyResetToken, resetPassword } from "../../hooks/auth/useLogin";
import Modal from "../../components/modal/Modal";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>();

  const password = watch("password");

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setIsVerifying(false);
        return;
      }

      try {
        const isValid = await verifyResetToken(token);
        setIsTokenValid(isValid);
      } catch (error) {
        setIsTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      setMessage(data);
    },
    onError: (error: any) => {
      setMessage(error.message);
    },
  });

  const onSubmit = (data: { password: string; confirmPassword: string }) => {
    if (!token) return;

    resetPasswordMutation.mutate({
      password: data.password,
      token: token,
    });
  };

  // Show loading state while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-white px-6 py-4 shadow-lg">
              <img
                src={"/Logo.jpeg"}
                alt="Logo"
                className="w-26 object-contain rounded-lg"
              />
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-[#1d2087]"
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
            </div>
            <p className="mt-4 text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-white px-6 py-4 shadow-lg">
              <img
                src={"/Logo.jpeg"}
                alt="Logo"
                className="w-26 object-contain rounded-lg"
              />
            </div>
          </div>
          <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has already been used.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-linear-to-br from-[#1d2087] to-[#393ca3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d2087] transition duration-300 ease-in-out hover:scale-[1.02]"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockLine className="text-gray-400" size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  className={`appearance-none block w-full pl-10 pr-10 py-2.5 border ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-[#1d2087] sm:text-sm transition duration-150 ease-in-out`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <RiEyeCloseLine
                      className="text-gray-400 hover:text-gray-600"
                      size={18}
                    />
                  ) : (
                    <RiEyeLine
                      className="text-gray-400 hover:text-gray-600"
                      size={18}
                    />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockLine className="text-gray-400" size={18} />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                  className={`appearance-none block w-full pl-10 pr-10 py-2.5 border ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-200"
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-[#1d2087] sm:text-sm transition duration-150 ease-in-out`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showConfirmPassword ? (
                    <RiEyeCloseLine
                      className="text-gray-400 hover:text-gray-600"
                      size={18}
                    />
                  ) : (
                    <RiEyeLine
                      className="text-gray-400 hover:text-gray-600"
                      size={18}
                    />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="rounded-xl bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs text-blue-700 mb-1">
                Password requirements:
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• At least one uppercase letter (A-Z)</li>
                <li>• At least one lowercase letter (a-z)</li>
                <li>• At least one number (0-9)</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-linear-to-br from-[#1d2087] to-[#393ca3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d2087] disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out hover:scale-[1.02]"
              >
                {resetPasswordMutation.isPending ? (
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
                    Resetting password...
                  </>
                ) : (
                  <>
                    <RiCheckLine size={16} />
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {message && resetPasswordMutation.isSuccess && (
        <Modal
          message="Your password has been successfully reset! Please login with your new password."
          success={true}
          action={() => {
            setMessage(null);
            navigate("/login");
          }}
        />
      )}

      {/* Error Modal */}
      {message && resetPasswordMutation.isError && (
        <Modal
          message={message}
          success={false}
          action={() => {
            setMessage(null);
          }}
        />
      )}
    </div>
  );
};

export default ResetPassword;
