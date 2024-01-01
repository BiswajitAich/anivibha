import { NextPage } from 'next'
import PopularClient from './PopularClient';

const PopularEpisodes: NextPage = async () => {
    let controller: AbortController | null = null;
    let data: any | null = null

    try {
        controller = new AbortController();
        const signal = controller.signal;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/anime/FetchPopular`, {
            // const res = await fetch("/api/anime/fetchTopAiring",{
            method: "POST",
            body: JSON.stringify({ page: "1" }),
            signal,
            next: {
                revalidate: 30000,
            }
        });
        data = await res.json()
        // console.log("data:::::::::::::", data)
    } catch (error) {
        // console.log("data:::::::::::::!!!!!found")
    }

    if (controller) {
        controller.abort();
        controller = null;
    }

    return (
        <>
            <PopularClient data={data} />
        </>
    )
}

export default PopularEpisodes