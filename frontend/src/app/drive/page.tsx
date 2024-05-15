"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MainArea from "./(components)/(layout)/(mainArea)/MainArea";

function Drive({ params }: { params?: { folderId: string } }) {
  const [lsUserId, setLsUserId] = useState("");
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
    } else {
      setLsUserId(userId);
    }
  }, []);
  return <MainArea />;
}

export default Drive;
