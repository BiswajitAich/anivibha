'use server';

import { SeriesInfo } from "../api/types/seriesInfo";

let controller: AbortController | null = null;
export const fetchInitialDataAction = async (Id: string): Promise<SeriesInfo | null> => {
    console.log("fetchInitialDataAction called");
    
    try {
        controller = new AbortController();
        const signal = controller.signal;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/anime/FetchInfo?id=${Id}`, {
            method: "GET",
            next: {
                revalidate: 10000,
            },
            signal
        });
        return await response.json();
    } catch (error) {
        console.log('Request fetchInitialDataAction error: ', error);
        return null;
    }
}