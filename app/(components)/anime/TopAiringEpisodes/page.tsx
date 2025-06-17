import { NextPage } from 'next'
import TopAiring from './TopAiring';

const TopAiringEpisodes: NextPage = async () => {
    let data: any | null = null

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/anime/FetchTopAiring`, {
        // const res = await fetch("/api/anime/fetchTopAiring",{
          method: "POST",
          body: JSON.stringify({ page: "1" }),
          next:{
            revalidate: 30000,
          }
        });
        data = await res.json()
        // console.log("data:::::::::::::", data)
      } catch (error) {
        // console.log("data:::::::::::::!!!!!found")
      }

    return (
        <>
          <TopAiring data={data} /> 
        </>
    )
}

export default TopAiringEpisodes