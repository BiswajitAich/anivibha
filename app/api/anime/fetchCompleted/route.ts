import { AnimePoster, parseAnimeList2 } from "@/app/utils/parsers/parse2";
import axios from "axios";
import { load } from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const baseUrl = process.env.ANIME_BASEURL;
        const page = new URL(req.nextUrl).searchParams.get('page') || "1";

        if (!baseUrl) {
            console.error("ANIME_BASEURL environment variable not found");
            return NextResponse.json(
                { error: "API configuration error", info: [] },
                { status: 500 }
            );
        }

        const ob = new AnimeClass(baseUrl);
        const info = await ob.fetchCompletedAnimeData(page);

        console.log("api/GET fetchCompletedAnimeData: info[0]:", info[0]);

        return NextResponse.json({ info: info || [] });

    } catch (error) {
        console.error('CompletedAnime data err:', error);

        return NextResponse.json(
            {
                error: "Failed to fetch completed anime data",
                info: [],
                message: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

class AnimeClass {
    constructor(private baseUrl: string) { }

    public async fetchCompletedAnimeData(page: string): Promise<AnimePoster[]> {
        try {
            const referer = `${this.baseUrl}`;
            const url = `${this.baseUrl}/completed?page=${page}`;
            const data = await this.fetchData(url, referer);
            const parsedData = await this.parseData(data);
            return parsedData;
        } catch (error) {
            console.error("fetchCompletedAnimeData error:", error);
            return [];
        }
    }

    // fetch html
    private fetchData = async (url: string, referer: string) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Referer": referer,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                },
                timeout: 10000,
            });

            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status} when fetching episode list from AJAX endpoint`);
            }

            return response.data;
        } catch (error) {
            console.error("fetchData error:", error);
            throw error;
        }
    }

    // parse the html
    private parseData = async (data: any): Promise<AnimePoster[]> => {
        try {
            const html = typeof data === 'string' ? data : data.html;
            if (!html || typeof html !== 'string') {
                console.error("HTML parsing failed. Response:", data);
                return [];
            }
            // console.log(html);
            
            const $ = load(html);
            return parseAnimeList2($);
        } catch (error) {
            console.error("parseData error:", error);
            return [];
        }
    }
}