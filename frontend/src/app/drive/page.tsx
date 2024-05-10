"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FC } from "react";

const Drive: FC = () => {
  const tree = useAppSelector((state: RootState) => state.items);

  return <div>hello</div>;
};

export default Drive;
