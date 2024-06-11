import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
function ParentItem({
  id,
  name,
  isLastItem,
}: {
  id: string;
  name: string;
  isLastItem: boolean;
}) {
  const router = useRouter();
  function onClick() {
    if (!isLastItem) {
      router.push(`/drive/${id}`);
    }
  }

  return (
    <div
      className={`flex flex-row w-full rounded-xl ${
        !isLastItem && "cursor-pointer  hover:bg-dustyPaperEvenDarker"
      }  px-0.5 text-center m-0`}
      onClick={onClick}
    >
      <Typography className='text-nowrap text-xl'>{name}</Typography>
      {!isLastItem && <ChevronRightIcon />}
    </div>
  );
}

export default ParentItem;
