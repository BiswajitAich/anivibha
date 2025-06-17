'use server';

import { AnimePoster } from "@/app/utils/parsers/parse2";

let controller: AbortController | null = null;

export const fetchCompletedAction = async (page: number = 1): Promise<AnimePoster[]> => {
    try {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => {
            controller?.abort();
        }, 30000); // 30 s

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/anime/fetchCompleted?page=${page}`, {
            method: "GET",
            next: {
                revalidate: 60 * 60 * 6,
            },
            signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        
        const data = await response.json();
        console.log("api/GET fetchCompletedAction: data:", data.info?.length || 0, "items");
        return data.info || [];

    } catch (error) {
        console.error("fetchCompletedAction error:", error);

        if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASES === 'build') {
            return [];
        }

        return [];
    } finally {
        controller = null;
    }
};