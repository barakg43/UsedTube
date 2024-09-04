"use client";
import { Typography } from "@mui/material";
import React, { FC, useState } from "react";
import youtube from "../../../../public/youtube.png";
import vimeo from "../../../../public/vimeo.png";
import Image, { StaticImageData } from "next/image";
import RegisterYouTubeAPIKey from "./RegisterYouTubeAPIKey";
import Logo from "@/app/(common)/(components)/Logo";
import { useRouter } from "next/navigation";

const ProviderBox: FC<{
    provider: string;
    setProvider: Function;
    imageSrc: StaticImageData;
}> = ({ provider, setProvider, imageSrc }) => {
    return (
        <div
            className="flex flex-col justify-center items-center rounded-2xl cursor-pointer border-bg-DustyPaper hover:bg-dustyPaperEvenDarker hover:text-dustyPaper border-2 p-4"
            onClick={() => setProvider(provider)}
        >
            <div className="flex flex-row justify-center items-center">
                <Image height={100} width={100} src={imageSrc} alt={provider} />
            </div>
            <Typography variant="h6">{provider}</Typography>
        </div>
    );
};

const ChooseProvider: FC<{ setProvider: Function }> = ({ setProvider }) => {
    const router = useRouter();
    return (
        <div>
            <div
                onClick={() => {
                    router.push("/");
                }}
            >
                <Logo />
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="my-10">
                    <Typography variant="h5">Choose Provider</Typography>
                </div>
                <div className="flex gap-4">
                    <ProviderBox
                        provider="YouTube"
                        setProvider={setProvider}
                        imageSrc={youtube}
                    />
                    <ProviderBox
                        provider="Vimeo"
                        setProvider={() => {}}
                        imageSrc={vimeo}
                    />
                    {/* PROVIDER BOX FOR EACH ADDITIONAL PROVIDER*/}
                </div>
            </div>
        </div>
    );
};

const ChooseFirstProvider = () => {
    const [provider, setProvider] = useState<string>("");
    return provider == "" ? (
        ChooseProvider({ setProvider })
    ) : provider === "YouTube" ? (
        <RegisterYouTubeAPIKey />
    ) : null;
};

export default ChooseFirstProvider;
