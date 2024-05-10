"use client";
import { useEffect, useState } from "react";
import RegistrationForm from "./(components)/RegistrationForm";
import RegisterYouTubeAPIKey from "./(components)/RegisterYouTubeAPIKey";
import { useAppDispatch } from "@/redux/hooks";

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <>{isRegistered ? <RegisterYouTubeAPIKey /> : <RegistrationForm setIsFinishFillingForm={setIsRegistered} />}</>
  );
};

export default Register;
