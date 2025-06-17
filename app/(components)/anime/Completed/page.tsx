import { NextPage } from "next";
import CompletedComponent from "./CompletedComponent";
import { fetchCompletedAction } from "./fetchCompletedAction";
import { AnimePoster } from "@/app/utils/parsers/parse2";

const CompletedEpisodes: NextPage = async () => {
    let initialData:AnimePoster[] = [];

    try {
        initialData = await fetchCompletedAction();
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
        initialData =  [] ;
    }

    return (
        <CompletedComponent
            info={initialData || []}
        />
    )
}

export default CompletedEpisodes;