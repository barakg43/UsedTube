"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { FC } from "react";

const Drive: FC = () => {
  const tree = useAppSelector((state: RootState) => state.items);
  const router = useRouter();

  return <div>hello</div>;
};

export default Drive;
