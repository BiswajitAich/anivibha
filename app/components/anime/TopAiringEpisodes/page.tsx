import { NextPage } from 'next'
import TopAiring from './TopAiring';

const TopAiringEpisodes: NextPage = async () => {
    let data: any | null = null

    try {
        const res = await fetch("http://localhost:3000/api/anime/FetchTopAiring", {
        // const res = await fetch("/api/anime/fetchTopAiring",{
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