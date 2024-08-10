"use client";
import { useState } from "react";
import RegistrationForm from "./(components)/RegistrationForm";
import Link from "next/link";
import Logo from "@/app/(common)/(components)/Logo";
import ChooseFirstProvider from "./(components)/ChooseFirstProvider";

const Register = () => {
    const [isFinishFillingForm, setIsFinishFillingForm] = useState(false);

    return (
        <div className="flex flex-col h-full">
            <div className="mt-7 ml-7">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            {isFinishFillingForm ? (
                <ChooseFirstProvider />
            ) : (
                <div className="mt-[7em]">
                    <RegistrationForm
                        setIsFinishFillingForm={setIsFinishFillingForm}
                    />
                </div>
            )}
        </div>
    );
};

export default Register;
