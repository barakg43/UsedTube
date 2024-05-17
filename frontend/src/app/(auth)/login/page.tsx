"use client";
import React, { useEffect } from "react";
import LoginForm from "./(components)/LoginForm";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

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
        <>
            <LoginForm />
        </>
    );
};

export default Login;
