"use client";
import React from "react";
import Logo from "../(common)/Logo";

function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <style jsx>{`
                @keyframes breathing {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                .animate-breathing {
                    animation: breathing 3s infinite ease-in-out;
                }
            `}</style>
            <div className="animate-breathing">
                <Logo color="black" />
            </div>
        </div>
    );
}

export default Loading;
