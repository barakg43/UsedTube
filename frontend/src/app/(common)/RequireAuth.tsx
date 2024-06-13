"use client";

import { useVerifyToken } from "@/hooks/auth/useVerifyToken";
import { useAppSelector } from "@/redux/hooks";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
