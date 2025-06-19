'use server';

import { AnimePoster } from "@/app/utils/parsers/parse2";

let controller: AbortController | null = null;

export const fetchDataAction = async (language: number, sort: string): Promise<AnimePoster[] | []> => {
    try {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => {
            controller?.abort();
        }, 30000); // 30 s

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/animePage`, {
            method: "POST",
            body: JSON.stringify({
                language,
                sort
            }),
            next: {
                revalidate: 60*60*1,
            },
            signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();
        console.log("Page revalidated: fetchDataAction completed:", new Date().toLocaleTimeString(), data.info.length, "items");
        return data.info as AnimePoster[] || [];
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