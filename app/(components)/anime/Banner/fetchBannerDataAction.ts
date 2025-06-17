'use server';
let controller: AbortController | null = null;
export const fetchBannerDataAction = async () => {
    try {
        controller = new AbortController();
        const signal = controller.signal;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/anime/fetchBanner`, {
            method: "GET",
            next: {
                revalidate: 10000,
            },
            signal
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
