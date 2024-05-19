"use client";
import { useState } from "react";
import RegistrationForm from "./(components)/RegistrationForm";
import RegisterYouTubeAPIKey from "./(components)/RegisterYouTubeAPIKey";
import Link from "next/link";
import Logo from "@/app/(common)/Logo";

const Register = () => {
    const [isRegistered, setIsRegistered] = useState(false);

    return (
        <div className="flex flex-col h-full">
            <div className="mt-7 ml-7">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            {isRegistered ? (
                <RegisterYouTubeAPIKey />
            ) : (
                <div className="mt-[7em]">
                    <RegistrationForm
                        setIsFinishFillingForm={setIsRegistered}
                    />
                </div>
            )}
        </div>
    );
};

export default Register;
