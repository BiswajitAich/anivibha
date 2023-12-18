import { NextPage } from 'next'
import TopAiring from './TopAiring';

const TopAiringEpisodes: NextPage = async () => {
    let data: any | null = null

    try {
        const res = await fetch("https://github.com/BiswajitAich/anivibha/api/anime/FetchTopAiring", {
        // const res = await fetch("/app/api/anime/fetchTopAiring",{
          method: "POST",
          body: JSON.stringify({ page: "1" }),
          next:{
            revalidate: 3000,
          }
        });
        data = await res.json()
        // console.log("data:::::::::::::", data)
      } catch (error) {
        console.log("data:::::::::::::!!!!!found")
      }

    return (
        <>
          <TopAiring data={data} /> 
        </>
    )
}

export default TopAiringEpisodes