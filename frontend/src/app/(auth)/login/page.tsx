"use client";
import React, { useEffect } from "react";
import LoginForm from "./(components)/LoginForm";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      router.push("/drive");
    }
  }, []);
  return (
    <>
      <LoginForm />
    </>
  );
};

export default Login;
