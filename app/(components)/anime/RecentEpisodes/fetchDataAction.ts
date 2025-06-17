'use server';

let controller: AbortController | null = null;

export const fetchDataAction = async (page: number, type: number) => {
    try {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => {
            controller?.abort();
        }, 30000); // 30 s

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
        clearTimeout(timeoutId);

        console.log("Page revalidated: fetchDataAction completed:", new Date().toLocaleTimeString());
        return await response.json();
    } catch (error) {
        console.error("fetchCompletedAction error:", error);

        if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASES === 'build') {
            return { info: [] };
        }

        return null;
    } finally {
        controller = null;
    }
};