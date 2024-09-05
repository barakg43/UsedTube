import { useStorageSpaceQuery } from "@/redux/api/driveApi";

function Quota() {
    const { data, error, isLoading } = useStorageSpaceQuery(undefined, {
        pollingInterval: 1000,
    });

    const totalSize = data?.value || 0;

    const formatSize = (size: number) => {
        if (size < 1024) return `${size} bytes`;
        else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        else if (size < 1024 * 1024 * 1024)
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    return (
        <div className="text-sm flex justify-center pt-4 mt-24 pb-6">
            {formatSize(totalSize)} used of 1024TB
        </div>
    );
}

export default Quota;
