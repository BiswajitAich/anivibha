import { CheerioAPI } from 'cheerio';

export interface RecentAnime {
    id: string;
    title: string;
    rate: string;
    sub: number;
    dub: number;
    eps: number;
    image: string;
}

export function parseAnimeList($: CheerioAPI): RecentAnime[] {
    const parseOut: RecentAnime[] = [];

    $('div.film_list-wrap > div.flw-item').each((_i, el) => {
        const rate = $(el).find('div.tick-rate').text().trim();
        const sub = parseInt($(el).find('div.tick-sub').text().replace(/\D/g, ''), 10) || 0;
        const dub = parseInt($(el).find('div.tick-dub').text().replace(/\D/g, ''), 10) || 0;
        const eps = parseInt($(el).find('div.tick-eps').text().replace(/\D/g, ''), 10) || 0;
        const image = $(el).find('div.film-poster img').attr('data-src') ||
                      $(el).find('div.film-poster img').attr('src') || '';
        const href = $(el).find('div.film-poster a').attr('href') || '';
        const id = href.split('/').pop() || '';
        const title = $(el).find('h3.film-name a').text().trim();

        if (id && title) {
            parseOut.push({ id, title, rate, image, sub, dub, eps });
        }
    });

    return parseOut;
}
