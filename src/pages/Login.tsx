import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeCloseLine,
} from "react-icons/ri";
import { loginSchema, type LoginData } from "../types/auth/loginTypes";
import { login } from "../hooks/auth/useLogin";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      reset();
      navigate("/visas/visa");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const onSubmit = (data: LoginData) => {
    mutation.mutate(data);
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
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
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
                  placeholder="you@example.com"
                  className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-[#1d2087] sm:text-sm transition duration-150 ease-in-out`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockLine className="text-gray-400" size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`appearance-none block w-full pl-10 pr-10 py-2.5 border ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1d2087] focus:border-[#1d2087] sm:text-sm transition duration-150 ease-in-out`}
                  {...register("password")}
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

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <NavLink
                  to="/user/reset-password"
                  className="font-medium text-[#1d2087] hover:text-[#393ca3] transition duration-150 ease-in-out"
                >
                  Forgot your password?
                </NavLink>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-linear-to-br from-[#1d2087] to-[#393ca3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d2087] disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out hover:scale-[1.02]"
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
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
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
