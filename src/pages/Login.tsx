import { useForm } from "react-hook-form";
import Header from "../components/auth/Header";
import Hero from "../components/auth/Hero";
import Button from "../components/button/Button";
import Input from "../components/input/Input";
import PasswordInput from "../components/input/PasswordInput";
import { loginSchema, type LoginData } from "../types/auth/loginTypes";
import { useMutation } from "@tanstack/react-query";
import { login } from "../hooks/auth/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
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
    <>
      <div className="relative w-full h-svh flex flex-col-reverse lg:flex-row items-center justify-center text-sm">
        <Hero />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="absolute w-90 rounded-3xl flex flex-col items-center justify-center px-8 py-12 gap-4 bg-white"
        >
          <Header />
          <Input
            style="bg-gray-100"
            disabled={false}
            type="text"
            placeholder="enter you e-mail"
            title="e-mail"
            error={errors.email && errors.email.message}
            {...register("email")}
          />
          <PasswordInput
            style="bg-gray-100"
            title="password"
            placeholder="enter your password"
            error={errors.password && errors.password.message}
            {...register("password")}
          />
          <p className="text-[#1d2087]">Sign Up?</p>
          <Button
            isLoading={mutation.isPending}
            title="Login"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300"
          />
          {error && <p className="text-sm font-normal text-red-700">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Login;
