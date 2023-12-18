"use server"
import { load } from 'cheerio';
import { NextResponse } from 'next/server';


export const POST = async (request: Request) => {
    const { page } = await request.json()
    // console.log("Page Param:", page);
    const pageParam = page;


    const ajaxUrl = 'https://ajax.gogo-load.com/ajax';
    const baseUrl = 'https://gogoanime3.net';

    const fetchTopAiring = async (page: number = 1): Promise<any> => {
        try {
            const response = await fetch(`${ajaxUrl}/page-recent-release-ongoing.html?page=${page}`);
            const data = await response.text();

            const $ = load(data);

            const topAiring: any[] = [];

            $('div.added_series_body.popular > ul > li').each((i, el) => {
                topAiring.push({
                    id: $(el).find('a:nth-child(1)').attr('href')?.split('/')[2]!,
                    title: $(el).find('a:nth-child(1)').attr('title')!,
                    image: $(el).find('a:nth-child(1) > div').attr('style')?.match('(https?://.*.(?:png|jpg))')![0],
                    url: `${baseUrl}${$(el).find('a:nth-child(1)').attr('href')}`,
                    genres: $(el)
                        .find('p.genres > a')
                        .map((i, el) => $(el).attr('title'))
                        .get(),
                });
            });

            const hasNextPage = !$('div.anime_name.comedy > div > div > ul > li').last().hasClass('selected');

            return {
                currentPage: page,
                hasNextPage: hasNextPage,
                results: topAiring,
            };
        } catch (err) {
            throw new Error('Something went wrong. Please try again later.');
        }
    };

    try {
        const topAiring = await fetchTopAiring(Number(pageParam));
        return new NextResponse(JSON.stringify(topAiring), { status: 201 })
    } catch (error) {
        console.error('Error fetching top airing anime:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

// export default POST;
