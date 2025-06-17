import { AnimePoster, parseAnimeList2 } from "@/app/utils/parsers/parse2";
import axios from "axios";
import { load } from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const baseUrl = process.env.ANIME_BASEURL;
    const page = new URL(req.nextUrl).searchParams.get('page') || "1";

    if (!baseUrl) throw new Error("API not found!");
    if (!page) throw new Error("page number not found!");
    const ob = new AnimeClass(baseUrl);
    try {
        const info = await ob.fetchCompletedAnimeData(page);
        console.log(info);
        return NextResponse.json({ info });
    } catch (error) {
        console.error('CompletedAnime data err:', error);
        throw new Error('CompletedAnime data fetch failed.');
    }
}

class AnimeClass {
    constructor(private baseUrl: string) { }

    public async fetchCompletedAnimeData(page: string): Promise<AnimePoster[]> {
        const referer = `${this.baseUrl}`;
        const url = `${this.baseUrl}/completed?page=${page}`;
        const data = await this.fetchData(url, referer);
        const parsedData = await this.parseData(data);
        return parsedData;
    }


    // fetch html
    private fetchData = async (url: string, referer: string) => {
        const response = await axios.get(url, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Referer": referer,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status} when fetching episode list from AJAX endpoint`);
        }
        return response.data;
    }

    // parse the html
    private parseData = async (data: any): Promise<AnimePoster[]> => {
        const html = typeof data === 'string' ? data : data.html;
        if (!html || typeof html !== 'string') {
            console.error("HTML parsing failed. Response:", data);
            throw new Error('Invalid HTML in response');
        }

        const $ = load(html);
        // console.log($.html()); 
        return parseAnimeList2($);
    }
}