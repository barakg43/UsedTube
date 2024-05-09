"use client";
import { useState } from "react";
import RegistrationForm from "./(components)/RegistrationForm";

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  return (
    <>
      <RegistrationForm />
      {/* api key retrieval */}
    </>
  );
};

export default Register;
