import { load } from 'cheerio';
const ajaxUrl = 'https://ajax.gogo-load.com/ajax';
const baseUrl = 'https://gogoanime3.net';

export const GET = async (request: Request) => {
    const url = new URL(request.url || '');
    const id = url.searchParams.get("id");
    // console.log("id::",id)
  
  const gogoanime = new Gogoanime(baseUrl, ajaxUrl);

  try {
    const info = await gogoanime.fetchAnimeInfo(String(id));
    return new Response(JSON.stringify(info))
  } catch (error) {
    return new Response(JSON.stringify({ error: error }))
  }
};


class Gogoanime {
  constructor(private baseUrl: string, private ajaxUrl: string) {}

  public async fetchAnimeInfo(id: string): Promise<any> {
    if (!id.includes('gogoanime')) id = `${this.baseUrl}/category/${id}`;

    const animeInfo: any = {
      id: '',
      title: '',
      url: '',
      genres: [],
      totalEpisodes: 0,
    };

    try {
      const res = await this.client.get(id);
      const $ = load(res.data);
      animeInfo.id = new URL(id).pathname.split('/')[2];
      animeInfo.title = $(
        'section.content_left > div.main_body > div:nth-child(2) > div.anime_info_body_bg > h1'
      )
        .text()
        .trim();
      animeInfo.url = id;
      animeInfo.image = $('div.anime_info_body_bg > img').attr('src');
      animeInfo.releaseDate = $('div.anime_info_body_bg > p:nth-child(7)')
        .text()
        .trim()
        .split('Released: ')[1];
      animeInfo.description = $('div.anime_info_body_bg > p:nth-child(5)')
        .text()
        .trim()
        .replace('Plot Summary: ', '');

      animeInfo.subOrDub = animeInfo.title.toLowerCase().includes('dub') ? "DUB": "SUB";

      animeInfo.type = $('div.anime_info_body_bg > p:nth-child(4) > a')
        .text()
        .trim()
        .toUpperCase() as string;

      animeInfo.status = "UNKNOWN";

      switch ($('div.anime_info_body_bg > p:nth-child(8) > a').text().trim()) {
        case 'Ongoing':
          animeInfo.status = "ONGOING";
          break;
        case 'Completed':
          animeInfo.status = "COMPLETED";
          break;
        case 'Upcoming':
          animeInfo.status = "NOT_YET_AIRED";
          break;
        default:
          animeInfo.status = "UNKNOWN";
          break;
      }
      animeInfo.otherName = $('div.anime_info_body_bg > p:nth-child(9)')
        .text()
        .replace('Other name: ', '')
        .replace(/;/g, ',');

      $('div.anime_info_body_bg > p:nth-child(6) > a').each((i, el) => {
        animeInfo.genres?.push($(el).attr('title')!.toString());
      });

      const ep_start = $('#episode_page > li').first().find('a').attr('ep_start');
      const ep_end = $('#episode_page > li').last().find('a').attr('ep_end');
      const movie_id = $('#movie_id').attr('value');
      const alias = $('#alias_anime').attr('value');

      const html = await this.client.get(
        `${
          this.ajaxUrl
        }/load-list-episode?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`
      );
      const $$ = load(html.data);

      animeInfo.episodes = [];
      $$('#episode_related > li').each((i, el) => {
        animeInfo.episodes?.push({
          id: $(el).find('a').attr('href')?.split('/')[1]!,
          number: parseFloat($(el).find(`div.name`).text().replace('EP ', '')),
          url: `${this.baseUrl}/${$(el).find(`a`).attr('href')?.trim()}`,
        });
      });
      animeInfo.episodes = animeInfo.episodes.reverse();

      animeInfo.totalEpisodes = parseInt(ep_end ?? '0');
      return animeInfo;
        } catch (err) {
          throw new Error(`failed to fetch anime info: ${err}`);
        }
      }

      private client = {
        get: async (url: string) => {

           const response = await fetch(url);
                const data = await response.text();
                return { data };
              },
            };
          }