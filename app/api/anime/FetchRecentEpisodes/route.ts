import { RecentAnime, parseAnimeList } from "@/app/utils/parsers/parse";
import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";

export const revalidate = 60;

export const POST = async (request: Request): Promise<NextResponse> => {
    try {
        const { page, type } = await request.json();
        const baseUrl = process.env.ANIME_BASEURL;

        if (!baseUrl) {
            console.error("ANIME_BASEURL environment variable not found");
            return NextResponse.json(
                { 
                    error: "API configuration error", 
                    info: {
                        page: 1,
                        type: 0,
                        info: []
                    } 
                },
                { status: 500 }
            );
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
                    .not('.disabled').length || 0;

                return {
                    currentPage: page || 1,
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


        const searchResult = await fetchRecentEpisodes(Number(page), Number(type));
        return NextResponse.json(searchResult || [], { status: 200 });
    } catch (error: unknown) {
        console.error("AnimeClass fetch EpisodeList error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch completed anime data",
                info: [],
                message: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
};
