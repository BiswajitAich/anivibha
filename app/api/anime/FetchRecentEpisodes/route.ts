import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";


export const POST = async (request:Request) => {
    const {page, type} = await request.json()

    const fetchRecentEpisodes = async (page: number, type: number): Promise<any> => {
        try {
            const response = await axios.get(
                `${process.env.Next_AJAXURL}/page-recent-release.html?page=${page}&type=${type}`,
            );
            const $ = load(response.data);
    
            const recentEpisodes: any[] = [];
    
            $("div.last_episodes.loaddub > ul > li").each((i, el) => {
                const id = $(el).find("a").attr("href")?.split("/")[1]?.split("-episode")[0];
                const episodeId = $(el).find("a").attr("href")?.split("/")[1];
                const episodeNumber = parseFloat($(el).find("p.episode").text().replace("Episode ", ""));
                const title = $(el).find("p.name > a").attr("title");
                const image = $(el).find("div > a > img").attr("src");
                const url = `${process.env.NEXT_BASEURL}${$(el).find("a").attr("href")?.trim()}`;
    
                if (id && episodeId && episodeNumber && title) {
                    recentEpisodes.push({
                        id,
                        episodeId,
                        episodeNumber,
                        title,
                        image,
                        url,
                    });
                }
            });
    
            const hasNextPage = !$("div.anime_name_pagination.intro > div > ul > li")
                .last()
                .hasClass("selected");
    
            return {
                currentPage: page,
                hasNextPage,
                results: recentEpisodes,
            };
        } catch (err) {
            throw new Error("Something went wrong. Please try again later.");
        }
    };
       
    try {
        const searchResult = await fetchRecentEpisodes(Number( page ), Number( type ));
        // console.log(JSON.stringify(searchResult))

        return new NextResponse(JSON.stringify(searchResult),{status: 201});
    } catch (error) {
        return new NextResponse("error!!!",{status: 500})
    }
};


