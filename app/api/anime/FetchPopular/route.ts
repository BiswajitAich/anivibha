import axios from "axios";
import { load } from "cheerio";

export const POST = async (req: Request) => {
  const { page } = await req.json();

  const baseUrl = `${process.env.NEXT_BASEURL}`;
  const fetchPopular = async (page: number = 1): Promise<any> => {
    try {
      const res = await axios.get(`${baseUrl}/popular.html?page=${page}`);

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

  try {
    const res = await fetchPopular(Number(page));
    // console.log(res);
    return new Response(JSON.stringify(res), { status: 201 });
  } catch (error) {
    console.log(JSON.stringify({ error: 'Internal Server Error' }));
  }


}