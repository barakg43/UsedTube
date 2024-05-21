"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { CircularProgress } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
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
