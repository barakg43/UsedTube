import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useFolderClick } from "../../../(hooks)/useFolderClick";

function PathTraceItem({
    id,
    name,
    isLastItem,
}: {
    id: string;
    name: string;
    isLastItem: boolean;
}) {
    const onClickItem = useFolderClick();
    const router = useRouter();

    function onClick() {
        if (!isLastItem) {
            onClickItem(id);
        }
    }

    return (
        <>
            <div
                className={`flex flex-row w-full rounded-xl ${
                    !isLastItem &&
                    "cursor-pointer  hover:bg-dustyPaperEvenDarker"
                }  px-0.5 text-center m-0`}
                onClick={onClick}
            >
                <Typography className="text-nowrap text-xl">{name}</Typography>
            </div>
            {!isLastItem && <ChevronRightIcon className="pt-2" />}
        </>
    );
}

export default PathTraceItem;
