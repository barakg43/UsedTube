"use client";

import { useVerifyToken } from "@/hooks/useVerifyToken";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Setup() {
  useVerifyToken();
  return <ToastContainer />;
}
