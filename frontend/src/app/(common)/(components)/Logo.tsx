import React, { FC } from "react";
import "@/app/globals.css";

interface LogoProps {
    color?: string | undefined;
}

const Logo: FC<LogoProps> = ({ color = "black" }) => {
    return (
        <div className="flex flex-col justify-center pl-5">
            <h1
                className={`text-4xl font-poetsen text-${color} [text-shadow:_0_2px_0_var(--tw-shadow-color)] shadow-neutral-400`}
            >
                UsedTube
            </h1>
        </div>
    );
};

export default Logo;
