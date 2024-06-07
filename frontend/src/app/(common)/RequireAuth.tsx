"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { CircularProgress } from "@mui/material";
import { useVerifyToken } from "@/hooks/auth/useVerifyToken";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  useVerifyToken();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);
  if (isLoading) {
    return (
      <div className='flex justify-center my-8'>
        <CircularProgress />
      </div>
    );
  }

  return <>{children}</>;
}
