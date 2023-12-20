import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";

export const POST = async (response:Response) => {

    const {page} = await response.json()
    const baseUrl = 'https://gogoanime3.net'
    const fetchRecentMovies = async (page: number = 1): Promise<any> => {
    try {
      const res = await axios.get(`${baseUrl}/anime-movies.html?aph&page=${page}`);

      const $ = load(res.data);

      const recentMovies: any[] = [];

      $('div.last_episodes > ul > li').each((i, el) => {
        const a = $(el).find('p.name > a');
        const pRelease = $(el).find('p.released');
        const pName = $(el).find('p.name > a');

        recentMovies.push({
          id: a.attr('href')?.replace(`/category/`, '')!,
          title: pName.attr('title')!,
          releaseDate: pRelease.text().replace('Released: ', '').trim(),
          image: $(el).find('div > a > img').attr('src'),
          url: `${baseUrl}${a.attr('href')}`,
        });
      });

      const hasNextPage = !$('div.anime_name.anime_movies > div > div > ul > li').last().hasClass('selected');

      return {
        currentPage: page,
        hasNextPage: hasNextPage,
        results: recentMovies,
      };
    } catch (err) {
      console.log(err);
      throw new Error('Something went wrong. Please try again later.');
    }
  };

  try{
    const response = await fetchRecentMovies(Number(page));
    return new NextResponse(JSON.stringify(response))
  }catch(error){
    return new NextResponse("Error !",{status: 500});
  }

}
