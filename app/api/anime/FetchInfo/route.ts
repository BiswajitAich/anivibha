import { NextResponse } from "next/server";
import { load } from "cheerio";
import axios from "axios";
import { Episode, RecommendedItem, SeriesInfo } from "../../types/seriesInfo";
export const revalidate = 60;
const epList = process.env.EPISODE_LIST;

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const idParam = url.searchParams.get("id");
  if (!idParam) {
    return NextResponse.json(
      { error: "Missing `id` parameter." },
      { status: 400 }
    );
  }
  
  const baseUrl = process.env.ANIME_BASEURL;

  if (!baseUrl) throw new Error("API not found!");
  const ob = new AnimeClass(baseUrl);

  try {
    const info = await ob.fetchEpisodeList(idParam);
    return NextResponse.json(info, { status: 200 });
  } catch (err: any) {
    console.error("AnimeClass fetch EpisodeList error:", err);
    const payload: any = {
      error: err.message || "Failed to fetch episode list.",
    };
    if (err.debugRaw) {
      payload.debugRaw = err.debugRaw;
    }
    return NextResponse.json(payload, { status: 500 });
  }
};

class AnimeClass {
  constructor(private baseUrl: string) {}

  public async fetchEpisodeList(seriesIdParam: string): Promise<SeriesInfo> {
    // Extract series ID from the parameter (e.g., "please-put-them-on-takamine-san-19548" -> "19548")
    const seriesSplit = seriesIdParam.split("-");
    const seriesId = seriesSplit[seriesSplit.length - 1];

    // Prepare URLs
    const ajaxUrl_epList = `${this.baseUrl}${epList}/${seriesId}`;
    const url_watchList = `${this.baseUrl}/${seriesIdParam}`;

    // Construct referer
    const referer = `${this.baseUrl}/watch/${seriesIdParam}`;

    try {
      // Fetch both URLs concurrently for better performance
      const [episodeResponse, watchResponse] = await Promise.all([
        this.fetchEpisodeData(ajaxUrl_epList, referer),
        this.fetchWatchPageData(url_watchList, referer),
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
        ...watchData,
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
        Accept: "application/json, text/javascript, */*; q=0.01",
        Referer: referer,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (response.status !== 200) {
      throw new Error(
        `HTTP ${response.status} when fetching episode list from AJAX endpoint`
      );
    }

    return response.data;
  }

  private async fetchWatchPageData(url: string, referer: string) {
    const response = await axios.get(url, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        Referer: referer,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status} when fetching watch page`);
    }

    return response.data;
  }

  private async parseEpisodeData(
    jsonData: any
  ): Promise<{ episodes: Episode[]; totalItems: number }> {
    // Validate JSON structure
    if (typeof jsonData !== "object" || jsonData === null) {
      const err: any = new Error("Unexpected JSON structure (not an object)");
      err.debugRaw = JSON.stringify(jsonData);
      throw err;
    }

    // Expecting { status: true, html: "...", totalItems: N }
    if (!jsonData.status || typeof jsonData.html !== "string") {
      console.error("Unexpected episode response structure");
      console.log("jsonData================:", jsonData);
    }

    const episodes: Episode[] = [];
    let totalItems: number = 0;

    // Parse the HTML snippet
    const $ = load(jsonData.html);

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
            japaneseTitle: jp,
          });
        }
      }
    });

    // Handle totalItems
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
    const titleMain = $("h2.film-name.dynamic-name").text().trim();
    const titleJapanese =
      $("h2.film-name.dynamic-name").attr("data-jname")?.trim() || "";
    const rate =
      $("div.anisc-poster .film-poster .tick.tick-rate").text().trim() || "";
    const pg = $("div.film-stats div.tick .tick-item.tick-pg").text().trim();
    const quality = $("div.film-stats div.tick .tick-item.tick-quality")
      .text()
      .trim();
    const sub =
      parseInt(
        $("div.film-stats div.tick .tick-item.tick-sub").text().trim(),
        10
      ) || 0;
    const dub =
      parseInt(
        $("div.film-stats div.tick .tick-item.tick-dub").text().trim(),
        10
      ) || 0;
    const eps =
      parseInt(
        $("div.film-stats div.tick .tick-item.tick-eps").text().trim(),
        10
      ) || 0;
    const image =
      $("div.film-poster img").attr("data-src") ||
      $("div.film-poster img").attr("src") ||
      "";

    // Extract detailed info
    const info: Record<string, any> = {};
    $(".anisc-info .item").each((_, el) => {
      const $el = $(el);
      let head = $el.find(".item-head").text().trim();
      head = head.replace(/:$/, "");

      if (head === "Overview") {
        const text = $el.find(".text").text().trim();
        info.overview = text;
      } else if (head === "Genres") {
        const genres = $el
          .find("a")
          .map((i, a) => $(a).text().trim())
          .get();
        info.genres = genres;
      } else {
        const names = $el
          .find(".name")
          .map((i, node) => $(node).text().trim())
          .get();
        info[this.camelCase(head)] = names.length > 1 ? names : names[0] || "";
      }
    });

    // Extract recommended items
    const recommended: RecommendedItem[] = [];
    $("section.block_area_category .film_list-wrap .flw-item").each((_, el) => {
      const $item = $(el);
      const anchor = $item.find(".film-poster a.film-poster-ahref");
      const href = anchor.attr("href") || "";
      const recId = anchor.attr("data-id") || "";
      const link = href ? new URL(href, this.baseUrl).href : "";

      let imgUrl =
        $item.find(".film-poster-img").attr("data-src") ||
        $item.find(".film-poster-img").attr("src") ||
        "";
      const subRecomended =
        parseInt(
          $item.find(".film-poster .tick.ltr .tick-item.tick-sub").text().trim()
        ) || 0;
      const dubRecomended =
        parseInt(
          $item.find(".film-poster .tick.ltr .tick-item.tick-dub").text().trim()
        ) || 0;
      const epsRecomended =
        parseInt(
          $item.find(".film-poster .tick.ltr .tick-item.tick-eps").text().trim()
        ) || 0;
      const rateRecomended =
        $item.find(".film-poster .tick.tick-rate").text().trim() || "";

      const titleEl = $item.find("h3.film-name a.dynamic-name");
      const recTitle = titleEl.text().trim();
      const recTitleJ = titleEl.attr("data-jname")?.trim() || "";

      const infoSpans = $item.find(".fd-infor .fdi-item");
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
        rate: rateRecomended,
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
      recommended,
    };
  }

  private camelCase(str: string): string {
    return str
      .toLowerCase()
      .split(/[\s\-]+/)
      .map((word, idx) =>
        idx === 0 ? word : word[0].toUpperCase() + word.slice(1)
      )
      .join("");
  }
}
