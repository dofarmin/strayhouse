"use client";

import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Model from "@/app/components/model";
import Heading from "@/app/components/heading";
import Input from "@/app/components/input";
import toast from "react-hot-toast";
import Button from "@/app/components/button";
import useRegisterModel from "@/app/hooks/useRegisterModel";
import { signIn } from "next-auth/react";
import useLoginModel from "@/app/hooks/useLoginModel";

const RegisterModel = () => {
  const loginModel = useLoginModel();
  const registerModel = useRegisterModel();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    (data) => {
      setIsLoading(true);

      axios
        .post("/api/register", data)
        .then(() => {
          toast.success("User created!");
          registerModel.onClose();
          loginModel.onOpen();
          reset();
        })
        .catch((err) => {
          toast.error(err.response?.data ?? "Something went wrong!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [registerModel, loginModel, reset]
  );

  const bodyContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <Heading title="Welcome to Stray House" subtitle="Create an account" />
        <Input
          required
          id="email"
          label="Email"
          errors={errors}
          disabled={isLoading}
          register={register}
        />
        <Input
          required
          id="name"
          label="Name"
          errors={errors}
          disabled={isLoading}
          register={register}
        />
        <Input
          required
          type="password"
          id="password"
          label="Password"
          errors={errors}
          disabled={isLoading}
          register={register}
        />
      </div>
    ),
    [isLoading, errors, register]
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        Icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        Icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="flex flex-row justify-center items-center gap-2">
          <div>Already have an account?</div>
          <div
            onClick={() => {
              registerModel.onClose();
              loginModel.onOpen();
            }}
            className="text-stone-800 cursor-pointer hover:underline"
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Model
      onSubmit={handleSubmit(onSubmit)}
      title="Register"
      actionLabel="Continue"
      isOpen={registerModel.isOpen}
      disabled={isLoading}
      onClose={registerModel.onClose}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModel;