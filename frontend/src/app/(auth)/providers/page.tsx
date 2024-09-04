"use client";
import { Button, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import youtube from "../../../../public/youtube.png";
import vimeo from "../../../../public/vimeo.png";
import dailymotion from "../../../../public/dailymotion.png";
import Image, { StaticImageData } from "next/image";
import RegisterYouTubeAPIKey from "./RegisterYouTubeAPIKey";
import Logo from "@/app/(common)/(components)/Logo";
import { useRouter } from "next/navigation";
import RegisterVimeoAPIKey from "./RegisterVimeoAPIKey";
import RegisterDailymotionAPIKey from "./RegisterDailyMotionAPIKey";

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
            <div className="flex flex-row justify-center items-center flex-grow">
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
                        setProvider={setProvider}
                        imageSrc={vimeo}
                    />
                    <ProviderBox
                        provider="DailyMotion"
                        setProvider={setProvider}
                        imageSrc={dailymotion}
                    />
                </div>
                <div className="mt-12 flex flex-col justify-center items-center">
                    <Typography className="mb-10" variant="h5">
                        Or
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            router.push("/login");
                        }}
                        sx={{
                            color: "black",
                            borderColor: "lightGray",
                        }}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ChooseFirstProvider = () => {
    const [provider, setProvider] = useState<string>("");

    switch (provider) {
        case "YouTube":
            return (
                <RegisterYouTubeAPIKey
                    goBack={() => {
                        setProvider("");
                    }}
                />
            );
        case "Vimeo":
            return (
                <RegisterVimeoAPIKey
                    goBack={() => {
                        setProvider("");
                    }}
                />
            );
        case "DailyMotion":
            return (
                <RegisterDailymotionAPIKey
                    goBack={() => {
                        setProvider("");
                    }}
                />
            );

        default:
            return ChooseProvider({ setProvider });
    }
};

export default ChooseFirstProvider;
