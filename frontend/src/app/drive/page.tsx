"use client";
import MainArea from "./(components)/(layout)/(mainArea)/MainArea";
import WithAuth from "../(common)/WithAuth";

function Drive({ params }: { params?: { folderId: string | undefined} }) {
  return <MainArea folderId={params?.folderId} />;
}

// export default WithAuth(Drive);
export default Drive;
