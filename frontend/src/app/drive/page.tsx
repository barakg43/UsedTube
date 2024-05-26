"use client";
import { useRouter } from "next/navigation";
import TopBar from "./(components)/(layout)/(topBar)/TopBar";
import Sidebar from "./(components)/(layout)/(sideBar)/Sidebar";
import MainArea from "./(components)/(layout)/(mainArea)/MainArea";

function Drive({ params }: { params?: { folderId: string | undefined } }) {
  // const router = useRouter();
  // const authToken = useAppSelector((state) => state.general.authToken);
  // useEffect(() => {
  //     if (!authToken) {
  //         router.push("/login");
  //     }
  // }, []);
  console.log(params?.folderId);
  return (
    <div className='flex flex-col h-full'>
      <TopBar />
      <div className='flex flex-row flex-grow bg-paper w-full h-full'>
        <Sidebar />
        <MainArea folderId={params?.folderId} />;
      </div>
    </div>
  );
}

export default Drive;
