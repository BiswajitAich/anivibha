import { NextPage } from 'next'
import TopAiring from '../../anime/TopAiringEpisodes/page'
import RecentEpisodes from '../../anime/RecentEpisodes/page'
import { Suspense } from 'react'



const Anime: NextPage = () => {
  return (
    <div>
      <Suspense fallback={<p>wait please ........</p>} >
        <TopAiring />
        <RecentEpisodes />
      </Suspense>
    </div>
  )
}

export default Anime