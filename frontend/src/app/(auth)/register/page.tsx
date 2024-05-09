"use client";
import { useEffect, useState } from "react";
import RegistrationForm from "./(components)/RegistrationForm";
import RegisterYouTubeAPIKey from "./(components)/RegisterYouTubeAPIKey";
import StoreProvider from "@/app/StoreProvider";
import { useAppDispatch } from "@/redux/hooks";

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <>
      {isRegistered ? <RegisterYouTubeAPIKey /> : <RegistrationForm setIsRegistered={setIsRegistered} />}
      {/* api key retrieval */}
    </>
  );
};

export default Register;
