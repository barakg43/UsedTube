import React, { useState } from "react";

const ShareModal = () => {
    const [email, setEmail] = useState("");

    const handleShare = () => {
        alert("share");
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div
                className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => alert("close")}
                >
                    &times;
                </button>
                <h3 className="text-lg font-medium mb-4">Share File</h3>
                <input
                    type="email"
                    placeholder="Enter email address"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={handleShare}
                >
                    Share
                </button>
            </div>
        </div>
    );
};

export default ShareModal;
