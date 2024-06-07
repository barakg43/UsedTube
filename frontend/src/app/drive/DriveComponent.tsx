import MainArea from "./(components)/(layout)/(mainArea)/MainArea";
import Sidebar from "./(components)/(layout)/(sideBar)/Sidebar";
import TopBar from "./(components)/(layout)/(topBar)/TopBar";

function DriveComponent({ folderId }: { folderId: string | undefined }) {
  return (
    <div className='flex flex-col h-full'>
      <TopBar />
      <div className='flex flex-row flex-grow bg-paper w-full h-full'>
        <Sidebar />
        <MainArea folderId={folderId} />;
      </div>
    </div>
  );
}

export default DriveComponent;
