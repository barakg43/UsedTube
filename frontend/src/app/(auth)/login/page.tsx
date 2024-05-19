"use client";
import React, { useEffect } from "react";
import LoginForm from "./(components)/LoginForm";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import Logo from "@/app/(common)/Logo";
import Link from "next/link";

const Login = () => {
    const router = useRouter();
    const authToken = useAppSelector((state) => state.general.authToken);
    useEffect(() => {
        console.log("login use effect authtoken: ", authToken);
        if (authToken) {
            router.push("/drive");
        }
    }, []);
    return (
        <div className="flex flex-col items-center">
            <div className="mt-[20%]">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <div className="mt-[2.5%]">
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
