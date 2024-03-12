import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";


export const POST = async (request:Request) => {
    const {page, type} = await request.json()


    const ajaxUrl = "https://ajax.gogo-load.com/ajax";
    const baseUrl = "https://gogoanime3.net";

    const fetchRecentEpisodes = async (page: number, type: number): Promise<any> => {
    try {
        const response = await axios.get(
            `${ajaxUrl}/page-recent-release.html?page=${page}&type=${type}`,
        );
        const $ = load(response.data);

        const recentEpisodes: any[] = [];

        $("div.last_episodes.loaddub > ul > li").each((i, el) => {
            recentEpisodes.push({
                id: $(el).find("a").attr("href")?.split("/")[1]?.split("-episode")[0]!,
                episodeId: $(el).find("a").attr("href")?.split("/")[1]!,
                episodeNumber: parseFloat($(el).find("p.episode").text().replace("Episode ", "")),
                title: $(el).find("p.name > a").attr("title")!,
                image: $(el).find("div > a > img").attr("src"),
                url: `${baseUrl}${$(el).find("a").attr("href")?.trim()}`,
            });
        });

        const hasNextPage = !$("div.anime_name_pagination.intro > div > ul > li")
            .last()
            .hasClass("selected");

        return {
            currentPage: page,
            hasNextPage: hasNextPage,
            results: recentEpisodes,
        };
    } catch (err) {
        throw new Error("Something went wrong. Please try again later.");
    }
};
   
    try {
        const searchResult = await fetchRecentEpisodes(Number( page  ), Number( type  ));
        return new NextResponse(JSON.stringify(searchResult),{status: 201});
    } catch (error) {
        return new NextResponse("error!!!",{status: 500})
    }
};


