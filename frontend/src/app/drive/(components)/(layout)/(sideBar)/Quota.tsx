import React from "react";

const Quota = () => {
    let how_much_left = 0;
    let quota_unit = "KB";
    const file_size = 1024
    const file_unit = "GB";

    return (
        <div className="text-sm flex justify-center pt-4 mt-24 pb-12">
            `{how_much_left + quota_unit} used of {file_size + file_unit}`
        </div>
    );
};

export default Quota;
