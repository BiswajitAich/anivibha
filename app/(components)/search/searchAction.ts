'use server';
import { parseSearchResults, SearchResults } from "@/app/utils/parsers/searchParser";
import { load } from "cheerio";

const baseUrl = `${process.env.ANIME_BASEURL}`;
export const searchAction = async (keywords: string, page: number = 1): Promise<SearchResults[]> => {
    const keyword = keywords.trim();

    const searchParsms = new URLSearchParams();
    searchParsms.append('keyword', keyword);
    if (page > 1) {
        searchParsms.append('page', String(page));
    }
    try {
        console.log(`${baseUrl}/ajax/movie/search/suggest?${searchParsms.toString()}`);

        const res = await fetch(`${baseUrl}/ajax/movie/search/suggest?${searchParsms.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            },
            next: {
                revalidate: 5,
            }
        });
        if (!res.ok) {
            console.log(`Error fetching search results: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        const html = json.html;
        console.log(json);
        if (!html) {
            console.log('No HTML content found in the response');
            return [];
        }
        const $ = load(html);

        console.log(`Searching for: ${keywords} on page ${page}`);
        console.log(baseUrl);

        return parseSearchResults($) as SearchResults[];
    } catch (err) {
        console.log('Error in searchAction:', err);
        return []
    }
};

