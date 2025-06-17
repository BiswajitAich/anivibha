import { RecentAnime, parseAnimeList } from "@/app/utils/parsers/parse";
import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";

export const revalidate = 60;

export const POST = async (request: Request) => {
    const { page, type } = await request.json();
    const baseUrl = process.env.ANIME_BASEURL;

    if (!baseUrl) {
        return NextResponse.json({ error: "Anime base URL is not configured." }, { status: 500 });
    }

    const fetchRecentEpisodes = async (
        page: number = 1,
        type: number
    ): Promise<{
        currentPage: number;
        hasNextPage: number;
        results: RecentAnime[];
    }> => {
        try {
            const url = `${baseUrl}/filter?language=${type}&sort=recently_updated&page=${page}`;
            console.log("Fetching URL:", url);

            const response = await axios.get(url);
            const $ = load(response.data);

            const result = parseAnimeList($);
            const hasNextPage = $('ul.pagination li.page-item.active')
                .nextAll('li.page-item')
                .not('.disabled').length;

            return {
                currentPage: page,
                hasNextPage,
                results: result,
            };
        } catch (err: unknown) {
            console.error("fetchRecentEpisodes error:", err);
            // Use axios error details if available
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data || err.message;
                throw new Error(`Failed to fetch episodes: ${msg}`);
            }
            // Fallback
            throw new Error("Unexpected error occurred while fetching episodes.");
        }
    };

    try {
        const searchResult = await fetchRecentEpisodes(Number(page), Number(type));
        return NextResponse.json(searchResult, { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("AnimeClass fetch EpisodeList error:", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
