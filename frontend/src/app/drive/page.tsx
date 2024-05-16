"use client";
import MainArea from "./(components)/(layout)/(mainArea)/MainArea";
import WithAuth from "../(common)/WithAuth";

function Drive({ params }: { params?: { folderId: string } }) {
  return <MainArea />;
}

export default WithAuth(Drive);
