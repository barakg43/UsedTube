"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { CircularProgress } from "@mui/material";
import { useVerifyToken } from "@/hooks/auth/useVerifyToken";

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  useVerifyToken();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  if (isLoading) {
    return (
      <div className='flex justify-center my-8'>
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}
