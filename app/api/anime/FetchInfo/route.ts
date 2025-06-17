import { NextResponse } from "next/server";
import { load } from "cheerio";
import axios from "axios";
import { Episode, RecommendedItem, SeriesInfo } from "../../types/seriesInfo";
export const revalidate = 60;

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const idParam = url.searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing `id` parameter." }, { status: 400 });
  }

  const baseUrl = process.env.ANIME_BASEURL;
  if (!baseUrl) throw new Error("API not found!");
  const ob = new AnimeClass(baseUrl);

  try {
    const info = await ob.fetchEpisodeList(idParam);
    return NextResponse.json(info, { status: 200 });
    /*return NextResponse.json(
      {
        "id": "chaos-dragon-8959",
        "totalItems": 12,
        "episodes": [
          {
            "number": 1,
            "id": "48414",
            "title": "Kill One to Save Many",
            "japaneseTitle": "Issatsutashou"
          },
          {
            "number": 2,
            "id": "48415",
            "title": "Antinomy",
            "japaneseTitle": "Niritsuhaihan"
          },
          {
            "number": 3,
            "id": "48416",
            "title": "Three as One",
            "japaneseTitle": "Sanmiittai"
          },
          {
            "number": 4,
            "id": "48417",
            "title": "Amid Enemies",
            "japaneseTitle": "Shimensoka"
          },
          {
            "number": 5,
            "id": "48418",
            "title": "In a Fog",
            "japaneseTitle": "Gorimuchuu"
          },
          {
            "number": 6,
            "id": "48419",
            "title": "Six Paths of Transmigration",
            "japaneseTitle": "Rokudourinne"
          },
          {
            "number": 7,
            "id": "48420",
            "title": "Ups and Downs in Life",
            "japaneseTitle": "Shichitenhakki"
          },
          {
            "number": 8,
            "id": "48421",
            "title": "Perfect Serenity",
            "japaneseTitle": "Hachimenreirou"
          },
          {
            "number": 9,
            "id": "48422",
            "title": "Winding",
            "japaneseTitle": "Tsuzuraori"
          },
          {
            "number": 10,
            "id": "48423",
            "title": "Narrow Escape from Death",
            "japaneseTitle": "Jisshiisshou"
          },
          {
            "number": 11,
            "id": "48424",
            "title": "Pandemonium",
            "japaneseTitle": "Hyakkiyagyou"
          },
          {
            "number": 12,
            "id": "48425",
            "title": "One Chance in a Million",
            "japaneseTitle": "Senzaiichiguu"
          }
        ],
        "titleMain": "Chaos Dragon",
        "titleJapanese": "Chaos Dragon: Sekiryuu Seneki",
        "rate": "18+",
        "quality": "HD",
        "pg": "R",
        "sub": 12,
        "dub": 12,
        "eps": 12,
        "image": "https://img.flawlessfiles.com/_r/300x400/100/92/5d/925d4e2c7a40c4f4e418bbe164badc8f/925d4e2c7a40c4f4e418bbe164badc8f.jpg",
        "info": {
          "overview": "In 3015, the year of Huanli, two countries, Donatia and Kouran, are embroiled in a war of supremacy that is tearing the world around them apart. The small island Nil Kamui has suffered exceptionally from the war, with lands conquered in the name of each kingdom and stolen away from the people. To make matters worse, their deity, the Red Dragon, has gone mad, rampaging about Nil Kamui burning villages and killing people indiscriminately.\n\nIbuki, a descendant of Nil Kamui's royal family, resides at an orphanage and refuses to take on the role of king. Abhorring conflict, Ibuki desires a peaceful resolution, however the chaotic world will not allow for such pacifism when it is being torn asunder by war. Despite his reluctance, Ibuki is drawn deep into this conflict. Can he rise to the occasion and save his country?",
          "japanese": "ケイオスドラゴン 赤竜戦役",
          "synonyms": "Red Dragon War",
          "aired": "Jul 2, 2015 to Sep 17, 2015",
          "premiered": "Summer 2015",
          "duration": "24m",
          "status": "Finished Airing",
          "malScore": "5.68",
          "genres": [
            "Action",
            "Fantasy",
            "Supernatural"
          ],
          "studios": [
            "Silver Link.",
            "Connect"
          ],
          "producers": [
            "Sotsu",
            "TOHO animation",
            "Silver Link.",
            "Connect",
            "Funimation"
          ]
        },
        "recommended": [
          {
            "id": "2969",
            "title": "Aru Tabibito no Nikki",
            "titleJapanese": "Aru Tabibito no Nikki",
            "link": "https://kaido.to/aru-tabibito-no-nikki-2969",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/1f/6b/1f6b6222b22d7db13f8c4aed81c0bf60/1f6b6222b22d7db13f8c4aed81c0bf60.jpg",
            "type": "ONA",
            "duration": "3m",
            "sub": 6,
            "dub": 0,
            "eps": 6,
            "rate": ""
          },
          {
            "id": "2973",
            "title": "Crayon Shin-chan Movie 08: Arashi wo Yobu Jungle",
            "titleJapanese": "Crayon Shin-chan Movie 08: Arashi wo Yobu Jungle",
            "link": "https://kaido.to/crayon-shin-chan-movie-08-arashi-wo-yobu-jungle-2973",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/d7/49/d74979e8165d17f1f7cc480a4fbedc47/d74979e8165d17f1f7cc480a4fbedc47.jpg",
            "type": "Movie",
            "duration": "88m",
            "sub": 1,
            "dub": 0,
            "eps": 0,
            "rate": ""
          },
          {
            "id": "2974",
            "title": "Devilman: The Birth",
            "titleJapanese": "Devilman: Tanjou-hen",
            "link": "https://kaido.to/devilman-the-birth-2974",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/aa/b4/aab4093ce5b616ce8f6120a481cad7b1/aab4093ce5b616ce8f6120a481cad7b1.jpg",
            "type": "OVA",
            "duration": "50m",
            "sub": 1,
            "dub": 1,
            "eps": 0,
            "rate": "18+"
          },
          {
            "id": "2975",
            "title": "Dragon Ball Z: Resurrection 'F'",
            "titleJapanese": "Dragon Ball Z Movie 15: Fukkatsu no \"F\"",
            "link": "https://kaido.to/dragon-ball-z-resurrection-f-2975",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/8c/6a/8c6a15cd6d86f5cfb8bf5c636f4d1234/8c6a15cd6d86f5cfb8bf5c636f4d1234.jpg",
            "type": "Movie",
            "duration": "107m",
            "sub": 1,
            "dub": 1,
            "eps": 0,
            "rate": ""
          },
          {
            "id": "2979",
            "title": "Legends of the Dark King: A Fist of the North Star Story",
            "titleJapanese": "Hokuto no Ken: Raoh Gaiden Ten no Haoh",
            "link": "https://kaido.to/legends-of-the-dark-king-a-fist-of-the-north-star-story-2979",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/76/9b/769b415bbf9c89d6d7a11895b0b88b2e/769b415bbf9c89d6d7a11895b0b88b2e.jpg",
            "type": "TV",
            "duration": "24m",
            "sub": 13,
            "dub": 13,
            "eps": 13,
            "rate": "18+"
          },
          {
            "id": "2986",
            "title": "Mayonaka no Occult Koumuin: Hitoribocchi no Kyuuketsuki",
            "titleJapanese": "Mayonaka no Occult Koumuin: Hitoribocchi no Kyuuketsuki",
            "link": "https://kaido.to/mayonaka-no-occult-koumuin-hitoribocchi-no-kyuuketsuki-2986",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/48/37/4837a6358f48608f8b0ce53041350e36/4837a6358f48608f8b0ce53041350e36.jpg",
            "type": "OVA",
            "duration": "27m",
            "sub": 2,
            "dub": 0,
            "eps": 2,
            "rate": ""
          },
          {
            "id": "2999",
            "title": "Dragon Ball Z: Bojack Unbound",
            "titleJapanese": "Dragon Ball Z Movie 09: Ginga Girigiri!! Bucchigiri no Sugoi Yatsu",
            "link": "https://kaido.to/dragon-ball-z-bojack-unbound-2999",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/54/88/5488ca75e7e1618397a17ded27f165c2/5488ca75e7e1618397a17ded27f165c2.jpg",
            "type": "Movie",
            "duration": "50m",
            "sub": 1,
            "dub": 1,
            "eps": 0,
            "rate": ""
          },
          {
            "id": "3001",
            "title": "Pretty Cure: Splash Star",
            "titleJapanese": "Futari wa Precure: Splash☆Star",
            "link": "https://kaido.to/pretty-cure-splash-star-3001",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/95/17/9517fbf8aed8b7573c513a4394e9063d/9517fbf8aed8b7573c513a4394e9063d.jpg",
            "type": "TV",
            "duration": "24m",
            "sub": 49,
            "dub": 0,
            "eps": 49,
            "rate": ""
          },
          {
            "id": "2982",
            "title": "Demon Prince Enma",
            "titleJapanese": "Kikoushi Enma",
            "link": "https://kaido.to/demon-prince-enma-2982",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/89/44/89443f6209e77397a757aa45602804f6/89443f6209e77397a757aa45602804f6.jpg",
            "type": "OVA",
            "duration": "40m",
            "sub": 4,
            "dub": 0,
            "eps": 4,
            "rate": "18+"
          },
          {
            "id": "2984",
            "title": "Vampire Princess Miyu",
            "titleJapanese": "Kyuuketsuhime Miyu (TV)",
            "link": "https://kaido.to/vampire-princess-miyu-2984",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/55/2d/552dbd5e9f8b75434776f34ee8e38a26/552dbd5e9f8b75434776f34ee8e38a26.jpg",
            "type": "TV",
            "duration": "25m",
            "sub": 26,
            "dub": 26,
            "eps": 26,
            "rate": "18+"
          },
          {
            "id": "2992",
            "title": "NARUTO Spin-Off: Rock Lee & His Ninja Pals",
            "titleJapanese": "Naruto SD: Rock Lee no Seishun Full-Power Ninden",
            "link": "https://kaido.to/naruto-spin-off-rock-lee-his-ninja-pals-2992",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/37/f8/37f8b16b0f693e433207117abe5daf44/37f8b16b0f693e433207117abe5daf44.jpg",
            "type": "TV",
            "duration": "24m",
            "sub": 51,
            "dub": 51,
            "eps": 51,
            "rate": ""
          },
          {
            "id": "2997",
            "title": "Doraemon Movie 10: Nobita and the Birth of Japan",
            "titleJapanese": "Doraemon Movie 10: Nobita no Nippon Tanjou",
            "link": "https://kaido.to/doraemon-movie-10-nobita-and-the-birth-of-japan-2997",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/7e/5f/7e5f5312545a5ecec647002ee57d1fd0/7e5f5312545a5ecec647002ee57d1fd0.jpg",
            "type": "Movie",
            "duration": "100m",
            "sub": 1,
            "dub": 0,
            "eps": 0,
            "rate": ""
          },
          {
            "id": "2998",
            "title": "Dororo and Hyakkimaru",
            "titleJapanese": "Dororo to Hyakkimaru",
            "link": "https://kaido.to/dororo-and-hyakkimaru-2998",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/e5/50/e55095f14b20af9350d200c03d7ac991/e55095f14b20af9350d200c03d7ac991.jpg",
            "type": "TV",
            "duration": "26m",
            "sub": 26,
            "dub": 0,
            "eps": 26,
            "rate": "18+"
          },
          {
            "id": "3004",
            "title": "Hell Teacher Nube OVA",
            "titleJapanese": "Jigoku Sensei Nube OVA",
            "link": "https://kaido.to/hell-teacher-nube-ova-3004",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/ae/48/ae489d3b895131b3370a9bbaef0d2402/ae489d3b895131b3370a9bbaef0d2402.jpg",
            "type": "OVA",
            "duration": "30m",
            "sub": 3,
            "dub": 0,
            "eps": 3,
            "rate": ""
          },
          {
            "id": "3009",
            "title": "Spiritpact",
            "titleJapanese": "Ling Qi",
            "link": "https://kaido.to/spiritpact-3009",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/e5/7a/e57a3aacc6d92eb6d3c39048df5f92fd/e57a3aacc6d92eb6d3c39048df5f92fd.jpg",
            "type": "ONA",
            "duration": "14m",
            "sub": 20,
            "dub": 0,
            "eps": 20,
            "rate": ""
          },
          {
            "id": "3011",
            "title": "Magical Angel Creamy Mami",
            "titleJapanese": "Mahou no Tenshi Creamy Mami",
            "link": "https://kaido.to/magical-angel-creamy-mami-3011",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/8c/ab/8cabb5354f35d32ae8f227e692d67601/8cabb5354f35d32ae8f227e692d67601.jpg",
            "type": "TV",
            "duration": "24m",
            "sub": 52,
            "dub": 0,
            "eps": 52,
            "rate": ""
          },
          {
            "id": "3017",
            "title": "Reikenzan: Hoshikuzu-tachi no Utage",
            "titleJapanese": "Reikenzan: Hoshikuzu-tachi no Utage",
            "link": "https://kaido.to/reikenzan-hoshikuzu-tachi-no-utage-3017",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/f7/97/f797e1c8961cae3fac50fd13f6a7cafa/f797e1c8961cae3fac50fd13f6a7cafa.jpg",
            "type": "TV",
            "duration": "24m",
            "sub": 12,
            "dub": 0,
            "eps": 12,
            "rate": ""
          },
          {
            "id": "3019",
            "title": "Soul Hunter",
            "titleJapanese": "Senkaiden Houshin Engi",
            "link": "https://kaido.to/soul-hunter-3019",
            "imageUrl": "https://img.flawlessfiles.com/_r/300x400/100/d5/70/d5703e18324a81a4381f7fe16cb202f0/d5703e18324a81a4381f7fe16cb202f0.jpg",
            "type": "TV",
            "duration": "24m",
            "sub": 26,
            "dub": 26,
            "eps": 26,
            "rate": ""
          }
        ]
      }
    )*/
  } catch (err: any) {
    console.error("AnimeClass fetch EpisodeList error:", err);
    const payload: any = { error: err.message || "Failed to fetch episode list." };
    if (err.debugRaw) {
      payload.debugRaw = err.debugRaw;
    }
    return NextResponse.json(payload, { status: 500 });
  }
};


class AnimeClass {
  constructor(private baseUrl: string) { }

  public async fetchEpisodeList(seriesIdParam: string): Promise<SeriesInfo> {
    // Extract series ID from the parameter (e.g., "please-put-them-on-takamine-san-19548" -> "19548")
    const seriesSplit = seriesIdParam.split('-');
    const seriesId = seriesSplit[seriesSplit.length - 1];

    // Prepare URLs
    const ajaxUrl_epList = `${this.baseUrl}/ajax/episode/list/${seriesId}`;
    const url_watchList = `${this.baseUrl}/${seriesIdParam}`;

    // Construct referer
    const referer = `${this.baseUrl}/watch/${seriesIdParam}`;

    try {
      // Fetch both URLs concurrently for better performance
      const [episodeResponse, watchResponse] = await Promise.all([
        this.fetchEpisodeData(ajaxUrl_epList, referer),
        this.fetchWatchPageData(url_watchList, referer)
      ]);

      // Parse episode data
      const episodeData = await this.parseEpisodeData(episodeResponse);

      // Parse watch page data
      const watchData = await this.parseWatchPageData(watchResponse);

      // Combine the data
      return {
        id: seriesIdParam,
        totalItems: episodeData.totalItems,
        episodes: episodeData.episodes,
        ...watchData
      };

    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  private async fetchEpisodeData(url: string, referer: string) {
    const response = await axios.get(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Referer": referer,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status} when fetching episode list from AJAX endpoint`);
    }

    return response.data;
  }

  private async fetchWatchPageData(url: string, referer: string) {
    const response = await axios.get(url, {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Referer": referer,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status} when fetching watch page`);
    }

    return response.data;
  }

  private async parseEpisodeData(jsonData: any): Promise<{ episodes: Episode[]; totalItems: number }> {
    // Validate JSON structure
    if (typeof jsonData !== "object" || jsonData === null) {
      const err: any = new Error("Unexpected JSON structure (not an object)");
      err.debugRaw = JSON.stringify(jsonData);
      throw err;
    }

    // Expecting { status: true, html: "...", totalItems: N }
    if (!jsonData.status || typeof jsonData.html !== "string") {
      const err: any = new Error("Unexpected episode response structure");
      err.debugRaw = JSON.stringify(jsonData);
      throw err;
    }

    // Parse the HTML snippet
    const $ = load(jsonData.html);
    const episodes: Episode[] = [];

    $(".ss-list a.ssl-item.ep-item").each((_, el) => {
      const elem = $(el);
      const dataNumber = elem.attr("data-number");
      const dataId = elem.attr("data-id");
      const titleAttr = elem.attr("title")?.trim() || "";
      const jp = elem.find(".ep-name").attr("data-jname")?.trim() || "";

      if (dataNumber && dataId) {
        const number = parseInt(dataNumber, 10);
        if (!isNaN(number)) {
          episodes.push({
            number: number,
            id: dataId,
            title: titleAttr,
            japaneseTitle: jp
          });
        }
      }
    });

    // Handle totalItems
    let totalItems: number;
    if (typeof jsonData.totalItems === "number") {
      totalItems = jsonData.totalItems;
    } else {
      const parsed = parseInt(String(jsonData.totalItems), 10);
      totalItems = isNaN(parsed) ? episodes.length : parsed;
    }

    return { episodes, totalItems };
  }

  private async parseWatchPageData(htmlData: string) {
    const $ = load(htmlData);

    // Extract main information
    const titleMain = $('h2.film-name.dynamic-name').text().trim();
    const titleJapanese = $('h2.film-name.dynamic-name').attr('data-jname')?.trim() || '';
    const rate = $('div.anisc-poster .film-poster .tick.tick-rate').text().trim() || '';
    const pg = $('div.film-stats div.tick .tick-item.tick-pg').text().trim();
    const quality = $('div.film-stats div.tick .tick-item.tick-quality').text().trim();
    const sub = parseInt($('div.film-stats div.tick .tick-item.tick-sub').text().trim(), 10) || 0;
    const dub = parseInt($('div.film-stats div.tick .tick-item.tick-dub').text().trim(), 10) || 0;
    const eps = parseInt($('div.film-stats div.tick .tick-item.tick-eps').text().trim(), 10) || 0;
    const image = $('div.film-poster img').attr('data-src') ||
      $('div.film-poster img').attr('src') || '';

    // Extract detailed info
    const info: Record<string, any> = {};
    $('.anisc-info .item').each((_, el) => {
      const $el = $(el);
      let head = $el.find('.item-head').text().trim();
      head = head.replace(/:$/, '');

      if (head === 'Overview') {
        const text = $el.find('.text').text().trim();
        info.overview = text;
      } else if (head === 'Genres') {
        const genres = $el.find('a').map((i, a) => $(a).text().trim()).get();
        info.genres = genres;
      } else {
        const names = $el.find('.name').map((i, node) => $(node).text().trim()).get();
        info[this.camelCase(head)] = names.length > 1 ? names : (names[0] || '');
      }
    });

    // Extract recommended items
    const recommended: RecommendedItem[] = [];
    $('section.block_area_category .film_list-wrap .flw-item').each((_, el) => {
      const $item = $(el);
      const anchor = $item.find('.film-poster a.film-poster-ahref');
      const href = anchor.attr('href') || '';
      const recId = anchor.attr('data-id') || '';
      const link = href ? new URL(href, this.baseUrl).href : '';

      let imgUrl = $item.find('.film-poster-img').attr('data-src')
        || $item.find('.film-poster-img').attr('src')
        || '';
      const subRecomended = parseInt($item.find('.film-poster .tick.ltr .tick-item.tick-sub').text().trim()) || 0;
      const dubRecomended = parseInt($item.find('.film-poster .tick.ltr .tick-item.tick-dub').text().trim()) || 0;
      const epsRecomended = parseInt($item.find('.film-poster .tick.ltr .tick-item.tick-eps').text().trim()) || 0;
      const rateRecomended = $item.find('.film-poster .tick.tick-rate').text().trim() || "";

      const titleEl = $item.find('h3.film-name a.dynamic-name');
      const recTitle = titleEl.text().trim();
      const recTitleJ = titleEl.attr('data-jname')?.trim() || '';

      const infoSpans = $item.find('.fd-infor .fdi-item');
      const recType = infoSpans.eq(0).text().trim() || undefined;
      const recDuration = infoSpans.eq(1).text().trim() || undefined;

      recommended.push({
        id: recId,
        title: recTitle,
        titleJapanese: recTitleJ,
        animeId: href,
        link,
        imageUrl: imgUrl,
        type: recType,
        duration: recDuration,
        sub: subRecomended,
        dub: dubRecomended,
        eps: epsRecomended,
        rate: rateRecomended
      });
    });

    return {
      titleMain,
      titleJapanese,
      rate,
      quality,
      pg,
      sub,
      dub,
      eps,
      image,
      info,
      recommended
    };
  }

  private camelCase(str: string): string {
    return str
      .toLowerCase()
      .split(/[\s\-]+/)
      .map((word, idx) => idx === 0 ? word : word[0].toUpperCase() + word.slice(1))
      .join('');
  }
}