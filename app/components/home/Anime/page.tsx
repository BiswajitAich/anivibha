import { NextPage } from 'next'
import TopAiring from '../../anime/TopAiringEpisodes/page'
import RecentEpisodes from '../../anime/RecentEpisodes/page'
import { Suspense } from 'react'
import SearchEpisodes from '../../anime/SearchEpisodes/page'



const Anime: NextPage = () => {
  return (
    <div>
      <Suspense fallback={<p>wait please ........</p>} >
        <SearchEpisodes />
        <TopAiring />
        <RecentEpisodes />
      </Suspense>
    </div>
  )
}

export default Anime