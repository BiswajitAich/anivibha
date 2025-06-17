import { AnimePoster, parseAnimeList2 } from "@/app/utils/parsers/parse2";
import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";

export const GET = async () => {
    const baseUrl = process.env.ANIME_BASEURL;
    if(!baseUrl) throw new Error("API not found!");
    const ob = new AnimeClass(baseUrl);
    try {
        const info = await ob.fetchBannerData();
        // console.log(info);
        return NextResponse.json({ info });
    } catch (error) {
        console.error('Banner data err:', error);
        throw new Error('Banner data fetch failed.');
    }
}

class AnimeClass {
    constructor(private baseUrl: string) { }

    public async fetchBannerData(): Promise<any> {
        const referer = `${this.baseUrl}`;
        const url = `${this.baseUrl}/filter?type=2&status=2&sort=most_watched`;
        const data = await this.fetchData(url, referer);
        const parsedData = await this.parseData(data);
        return parsedData;
    }

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

    private parseData = async (data: any): Promise<AnimePoster[]> => {
        const html = typeof data === 'string' ? data : data.html;
        if (!html || typeof html !== 'string') {
            console.error("HTML parsing failed. Response:", data);
            throw new Error('Invalid HTML in response');
        }

        const $ = load(html);
        // console.log($.html()); 
        return parseAnimeList2($, 12);
    }
}