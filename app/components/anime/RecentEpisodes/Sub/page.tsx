
import type { NextPage } from "next";
import DubClient from "./SubClient";



const Dub: NextPage = async () => {

    let data: any | null = null;
    try {
        const response = await fetch(`${window.location.origin}/api/anime/FetchRecentEpisodes`, {
            method: "POST",
            body: JSON.stringify({
                page: "1",
                type: "1"
            }),
            next: {
                revalidate: 3000,
            }
        });
        data = await response.json()

    } catch (error) {
        console.error(error);
    }




    return (
        <div >
            <DubClient data={data} />
        </div>
    );
};

export default Dub;