'use server';

let controller: AbortController | null = null;

export const fetchDataAction = async (page: number, type: number) => {
    try {
        controller = new AbortController();
        const signal = controller.signal;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/anime/FetchRecentEpisodes`, {
            method: "POST",
            body: JSON.stringify({
                page: page,
                type: type
            }),
            next: {
                revalidate: 10000,
            },
            signal
        });
        console.log(response);
        
        if(!response.ok) throw new Error("response error for recent episode: ")
        console.log("Page revalidated:", new Date().toLocaleTimeString());
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};