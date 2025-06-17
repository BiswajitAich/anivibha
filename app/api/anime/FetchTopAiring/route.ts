import { load } from 'cheerio';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { parseAnimeList } from '../../../utils/parsers/parse'; 

export const POST = async (request: Request) => {
    const { page } = await request.json()
    const pageParam = page;

    const baseUrl = '';

    const fetchTopAiring = async (page: number = 1): Promise<any> => {
        try {
            const response = await axios.get(`${baseUrl}/browser?keyword=&sort=updated_date&language%5B%5D=dub&page=${page}`);
            const $ = load(response.data);

            const topAiring=parseAnimeList($)

            const hasNextPage = $('ul.pagination li.active + li').length > 0;

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
        console.log(topAiring);
        return new NextResponse(JSON.stringify(topAiring), { status: 201 })
    } catch (error) {
        console.error('Error fetching top airing anime:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

