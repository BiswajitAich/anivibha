'use server';

let controller: AbortController | null = null;

export const fetchCompletedAction = async (page: number = 1) => {
    try {
        controller = new AbortController();
        const signal = controller.signal;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/anime/fetchCompleted?page=${page}`, {
            method: "GET",
            next: {
                revalidate: 60 * 60 * 6,
            },
            signal
        });
        console.log("Page revalidated (fetchCompletedAction):", new Date().toLocaleTimeString());
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};