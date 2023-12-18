
import type { NextPage } from "next";
import ChineseClient from './ChineseClient'


const Chinese: NextPage<any> = async () => {

    let data: any | null = null;
    try {
        const response = await fetch("https://anivibha.vercel.app/api/anime/FetchRecentEpisodes", {
            method: "POST",
            body: JSON.stringify({
                page: "1",
                type: "3"
            }),
            next: {
                revalidate: 3000,
            }
        });
        data = await response.json()

        // console.log(data.results);
    } catch (error) {
        console.error(error);
    }

    return (
        <div>
            <ChineseClient data={data} />
        </div>
    );
};

export default Chinese;
