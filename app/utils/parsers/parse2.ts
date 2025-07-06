import { CheerioAPI } from 'cheerio';

export interface AnimePoster {
    sub: string;
    dub: string;
    eps: string;
    name: string;
    JapaneseName: string;
    url: string;
    id: string;
    animeId: string;
    rate: string;
    itemType: string;
    duration: string;
}

export function parseAnimeList2($: CheerioAPI, len: number = Infinity): AnimePoster[] {
    const parseOut: AnimePoster[] = [];

    const els = $('.film_list-wrap .flw-item').toArray();
    for (const el of els) {
        if (parseOut.length >= len) break;
        const ele = $(el);
        const sub = ele.find('.tick.ltr .tick-item.tick-sub').text().trim() || '';
        const dub = ele.find('.tick.ltr .tick-item.tick-dub').text().trim() || '';
        const eps = ele.find('.tick.ltr .tick-item.tick-eps').text().trim() || '';
        const name = ele.find('.film-detail .film-name .dynamic-name').attr('title') ||
            ele.find('.film-detail .film-name .dynamic-name').text().trim() || '';
        const JapaneseName = ele.find('.film-detail .film-name .dynamic-name').attr('data-jname') || '';
        const url = ele.find('.film-poster-img').attr('data-src') || '';
        const id = ele.find('.film-poster-ahref.item-qtip').attr('data-id');
        const animeId = ele.find('.film-poster-ahref.item-qtip').attr('href')?.replace('/', '') || '';
        const rate = ele.find('.film-poster .tick.tick-rate').text().trim() || '';
        const itemType = ele.find('.fd-infor .fdi-item:not(.fdi-duration)').first().text().trim() || '';
        const duration = ele.find('.fd-infor .fdi-item.fdi-duration').text().trim() || '';
        if (url && id && animeId && name) {
            parseOut.push({
                sub,
                dub,
                eps,
                name,
                JapaneseName,
                url,
                id,
                animeId,
                rate,
                itemType,
                duration,
            })
        }
    }


    return parseOut;
}
