import axios from "axios";
import { load } from "cheerio";
import { NextResponse } from "next/server";



export const POST = async (request: Request) =>{
    const {query, page} = await request.json();

    const baseUrl = 'https://gogoanime3.net';



    const search = async (query: string, page: number = 1): Promise<any> => {
        const searchResult: any = {
          currentPage: page,
          hasNextPage: false,
          results: [],
        };
        try {
          const res = await axios.get(
            `${baseUrl}/filter.html?keyword=${encodeURIComponent(query)}&page=${page}`
          );
    
          const $ = load(res.data);
    
          searchResult.hasNextPage =
            $('div.anime_name.new_series > div > div > ul > li.selected').next().length > 0;
    
          $('div.last_episodes > ul > li').each((i: any, el: any) => {
            searchResult.results.push({
              id: $(el).find('p.name > a').attr('href')?.split('/')[2]!,
              title: $(el).find('p.name > a').attr('title')!,
              url: `${baseUrl}/${$(el).find('p.name > a').attr('href')}`,
              image: $(el).find('div > a > img').attr('src'),
              releaseDate: $(el).find('p.released').text().trim(),
              subOrDub: $(el).find('p.name > a').text().toLowerCase().includes('dub')
                ? "DUB"
                : "SUB",
            });
          });
    
          return searchResult;
        } catch (err) {
          throw new Error((err as Error).message);
        }
      };

      try{

          const res = await search(String(query), Number(page));
          // console.log(res)
          return new NextResponse(JSON.stringify(res));
        }catch(error){
            // console.log(error)
            return new NextResponse("data !found !")
        }



}