import { CheerioAPI } from 'cheerio';

export interface RecentAnime {
    id: string;
    title: string;
    rate: string;
    sub: string;
    dub: string;
    eps: string;
    image: string;
}

export function parseAnimeList($: CheerioAPI): RecentAnime[] {
    const parseOut: RecentAnime[] = [];

    $('div.film_list-wrap > div.flw-item').each((_i, el) => {
        const rate = $(el).find('div.tick-rate').text().trim() || '';
        const sub = $(el).find('div.tick-sub').text().trim() || '';
        const dub = $(el).find('div.tick-dub').text().trim() || '';
        const eps = $(el).find('div.tick-eps').text().trim() || '';
        const image = $(el).find('div.film-poster img').attr('data-src') ||
            $(el).find('div.film-poster img').attr('src') || '';
        const href = $(el).find('div.film-poster a').attr('href') || '';
        const id = href.split('/').pop() || '';
        const title = $(el).find('h3.film-name a').text().trim() || '';

        if (id && title) {
            parseOut.push({ id, title, rate, image, sub, dub, eps });
        }
    });

    return parseOut;
}
