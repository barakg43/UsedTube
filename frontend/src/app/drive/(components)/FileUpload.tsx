import api_root from "@/config";
import React from "react";

const FileUpload = () => {
  return (
    <form action={`${api_root}/FILL_LATER_WITH_ENDPOINT`} method="POST">
      <input type="file" name="file" />
      <button type="submit">upload</button>
      <button type="reset">cancel</button>
    </form>
  );
};

export default FileUpload;
