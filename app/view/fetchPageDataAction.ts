'use server';
import { AnimePoster } from "../utils/parsers/parse2";
let controller: AbortController | null = null;
export const fetchPageDataAction = async (page?: string, category?: string, language?: number, sort?: string): Promise<AnimePoster[]> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
    console.log(`   ->fetchPageDataAction : page: ${page}, category: ${category}, language: ${language}, sort: ${sort}`);

    try {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();
        const signal = controller.signal;

        timeoutId = setTimeout(() => {
            controller?.abort();
        }, 10000); 


        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/animePage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                category,
                language,
                page,
                sort
            }),
            next: {
                revalidate: 60 * 60 * 1,
            },
            // cache: 'no-store',
            signal
        });
        console.log("Page revalidated: fetchPageDataAction completed:", new Date().toLocaleTimeString());
        const data = await response.json();
        console.log(`Data fetched for anime ID ${page}:`, data.info.length, "items");

        return data.info as AnimePoster[] || [];
    } catch (error) {
        console.log(`Error fetching data for anime ID ${page}:`, error);
        return [];
    } finally {
        clearTimeout(timeoutId);
    }
}