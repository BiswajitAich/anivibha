import { CheerioAPI } from "cheerio";
export interface SearchResults {
    id: string;
    name: string;
    japaneseName: string;
    alias: string;
    releaseDate: string;
    type: string;
    duration: string;
    image: string;
}
export function parseSearchResults($: CheerioAPI): SearchResults[] {
    const firstItem = $('a.nav-item').first();
    const isNoResults = firstItem.attr('href') === 'javascript:;' && firstItem.text().includes('No results found!');

    if (isNoResults) {
        console.warn("No results found!");
        return [];
    }
    const results: SearchResults[] = [];
    $('a.nav-item').each((_, el) => {
        const $el = $(el);

        const href = $el.attr('href');
        const id = href?.split('/')[1].split('?')[0] || "";

        const name = $el.find('h3.film-name').text().trim();
        const japaneseName = $el.find('h3.film-name').attr('data-jname') || "";
        const alias = $el.find('.alias-name').text().trim();
        const image = $el.find('img').attr('data-src') || "";

        const infoContainer = $el.find('.film-infor');
        const releaseDate = infoContainer.find('span').first().text().trim() || "";
        const duration = infoContainer.find('span').last().text().trim() || "";
        let type = '';
        infoContainer.contents().each((_, node) => {
            if (node.type === 'text') {
                const value = node.data?.trim();
                if (value && !type) {
                    type = value;
                }
            }
        });

        if (id || image) {
            results.push({
                id,
                name,
                japaneseName,
                alias,
                releaseDate,
                type,
                duration,
                image,
            });
        }
    });

    return results.slice(0, -1);
}


