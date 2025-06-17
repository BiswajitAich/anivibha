import { NextPage } from "next";
import CompletedComponent from "./CompletedComponent";
import { fetchCompletedAction } from "./fetchCompletedAction";

const CompletedEpisodes: NextPage = async () => {
    // Fetch initial data on the server
    const initialData = await fetchCompletedAction();

    return (
        <CompletedComponent
            info={initialData?.info}
        />
    )
}

export default CompletedEpisodes;