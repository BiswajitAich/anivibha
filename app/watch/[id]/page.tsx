import WatchComponent from "../watchComponent";
import { fetchInitialDataAction } from "../fetchInitialWatchDataAction";
import { SeriesInfo } from "@/app/api/types/seriesInfo";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ type?: string }>;
}

const Watch = async ({ params, searchParams }: PageProps) => {
    // Await both params and searchParams
    const { id } = await params;
    const searchParamsType = await searchParams;

    if (typeof id !== "string") {
        throw new Error("Invalid or missing series ID.");
    }

    const info: SeriesInfo | null = await fetchInitialDataAction(id);
    if (!id || !info) {
        return <div>Not Found</div>;
    }

    return (
        <>
            <WatchComponent
                info={info}
                type={searchParamsType?.type}
                paramsId={id}
            />
        </>
    );
};

export default Watch;