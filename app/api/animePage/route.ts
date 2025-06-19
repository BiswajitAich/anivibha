import { AnimePoster, parseAnimeList2 } from "@/app/utils/parsers/parse2";
import axios from "axios";
import { load } from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { LanguageCategory, PageCategory, SortCategory, validLanguageCategory, validPageCategory, validSortCategory } from "../types/pageCategory";

interface RequestBody {
    category?: string;
    sort?: string;
    language?: number;
    page?: string;
}

export const POST = async (request: NextRequest) => {
    console.log("->>>Received POST request at /api/animePage");
    
    try {
        const baseUrl = process.env.ANIME_BASEURL;
        if (!baseUrl) {
            console.error("API base URL not configured (ANIME_BASEURL missing)");
            return NextResponse.json(
                { error: "Base URL not configured", info: [] },
                { status: 500 }
            );
        }

        let body: RequestBody;
        try {
            body = await request.json();
        } catch (e) {
            console.error("Failed to parse JSON body:", e);
            return NextResponse.json(
                { error: "Invalid JSON body", info: [] },
                { status: 400 }
            );
        }
        console.log("Request received at /api/animePage with body:", body);

        const { category, sort, language, page } = body;

        // page: default 1
        console.log('----------------------------------before', typeof page, page);

        let pageNum = "1"; // Default value

        if (typeof page !== 'undefined' && page !== null) {
            const numPage = Number(page);
            if (isNaN(numPage) || numPage < 1) {
                console.warn(`Invalid page "${page}" provided. Defaulting to 1.`);
            } else {
                pageNum = String(numPage);
            }
        } else {
            console.warn('No page provided. Defaulting to 1.');
        }

        console.log('----------------------------------after', typeof page, page);


        let info: AnimePoster[] = [];
        if (category) {
            // Validate category
            if (!isValidPageCategory(category)) {
                console.warn(`Invalid category "${category}" provided.`);
                return NextResponse.json(
                    { error: `Invalid category "${category}"`, info: [] },
                    { status: 400 }
                );
            }
            console.log(
                `Fetching by category "${category}" on page ${pageNum}`
            );
            info = await fetchByPageCategory(baseUrl, category, pageNum);
            return NextResponse.json({ info }, { status: 200 });

        } else if (sort || language) {
            // Branch: fetch by sort/language
            const sortVal = sort || "default";
            const langValRaw = language !== undefined ? language : 0;

            // Validate sort
            if (!isValidSort(sortVal)) {
                console.warn(`Invalid sort "${sortVal}" provided. Defaulting to "default".`);
            }
            // Validate language
            if (!isValidLanguage(langValRaw)) {
                console.warn(`Invalid language "${langValRaw}" provided. Defaulting to 0.`);
            }

            console.log(
                `Fetching by sort "${sortVal}", language ${langValRaw}, page ${pageNum}`
            );
            info = await fetchBySortCategory(baseUrl, sortVal, langValRaw, pageNum);
            return NextResponse.json({ info }, { status: 200 });

        } else {
            // Neither category nor sort/language provided
            console.warn("No valid parameters provided (category or sort/language required).");
            return NextResponse.json(
                { error: "Provide either 'category' or at least one of 'sort'/'language'", info: [] },
                { status: 400 }
            );
        }
    } catch (err) {
        console.error("Unexpected server error in /api/animePage:", err);
        return NextResponse.json(
            { error: "Server error", info: [] },
            { status: 500 }
        );
    }
};

// Helper: validate page categories
function isValidPageCategory(cat: string): cat is PageCategory {
    return (validPageCategory as string[]).includes(cat);
}

// Helper: validate sort categories
function isValidSort(sort: string): sort is SortCategory {
    return (validSortCategory as string[]).includes(sort);
}

// Helper: validate language categories
function isValidLanguage(lang: number): lang is LanguageCategory {
    return (validLanguageCategory as number[]).includes(lang);
}

// Fetch by page-category
async function fetchByPageCategory(
    baseUrl: string,
    category: PageCategory,
    page: string
): Promise<AnimePoster[]> {
    const referer = baseUrl;
    console.log(
        `-> fetchByPageCategory: category="${category}", page=${page}`
    );
    const url = `${baseUrl}/${category}?page=${page}`;
    console.log(`   Fetching URL: ${url}`);
    const html = await fetchHtml(url, referer);
    const parsed = parseHtmlToAnimeList(html);
    console.log(
        `   Parsed ${parsed.length} items for category "${category}" on page ${page}`
    );
    return parsed;
}

// Fetch by sort/language, with optional page param if applicable
async function fetchBySortCategory(
    baseUrl: string,
    sort: string,
    language: number,
    page: string
): Promise<AnimePoster[]> {
    const referer = baseUrl;
    const checkedSort = isValidSort(sort) ? sort : "default";
    const checkedLang = isValidLanguage(Number(language)) ? language : 0;
    console.log(
        `-> fetchBySortCategory: sort="${checkedSort}", language=${checkedLang}, page=${page}`
    );
    // Build query params
    const params = new URLSearchParams();
    params.append("sort", checkedSort);
    if (checkedLang !== 0) {
        params.append("language", String(checkedLang));
    }
    // If filter endpoint supports pagination:
    if (Number(page) > 0) {
        params.append("page", String(page));
    }
    const url = `${baseUrl}/filter?${params.toString()}`;
    console.log(`-> fetchBySortCategory: URL=${url}`);
    const html = await fetchHtml(url, referer);
    const parsed = parseHtmlToAnimeList(html);
    console.log(
        `   Parsed ${parsed.length} items for sort="${checkedSort}", language=${checkedLang}, page=${page}`
    );
    return parsed;
}

// Core: fetch HTML string from given URL
async function fetchHtml(url: string, referer: string): Promise<string> {
    console.log(`   -> fetchHtml: GET ${url}`);
    const response = await axios.get(url, {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json, text/javascript, */*; q=0.01",
            Referer: referer,
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        responseType: "json", // we expect JSON with an `html` field, or raw HTML as string
        validateStatus: (status) => status === 200,
    });

    const data = response.data;
    // If endpoint returns JSON with { html: "<...>" }
    if (data && typeof data === "object" && typeof data.html === "string") {
        return data.html;
    }
    // If it returns raw HTML string directly:
    if (typeof data === "string") {
        return data;
    }
    console.error("Unexpected response format from fetchHtml:", data);
    throw new Error("Invalid response format");
}

// Core: parse HTML into AnimePoster[]
function parseHtmlToAnimeList(html: string): AnimePoster[] {
    if (!html) {
        console.error("parseHtmlToAnimeList received empty HTML");
        return [];
    }
    const $ = load(html);
    try {
        const list = parseAnimeList2($);
        return list;
    } catch (e) {
        console.error("Error in parseAnimeList2:", e);
        return [];
    }
}
