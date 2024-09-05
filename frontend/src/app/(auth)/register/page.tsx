"use client";
import RegistrationForm from "./(components)/RegistrationForm";
import Link from "next/link";
import Logo from "@/app/(common)/(components)/Logo";

const Register = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="mt-7 ml-7">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <div className="mt-[7em]">
                <RegistrationForm />
            </div>
        </div>
    );
};

export default Register;
