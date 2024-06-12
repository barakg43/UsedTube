// "use client";
import Logo from "@/app/(common)/Logo";
import Link from "next/link";
import LoginForm from "./(components)/LoginForm";

const Login = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="mt-[20%]">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <div className="mt-[2.5%]">
                <Login Form />
            </div>
        </div>
    );
};

export default Login;
