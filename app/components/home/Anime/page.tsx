import { NextPage } from 'next'
import TopAiring from '../../anime/TopAiringEpisodes/page'
import RecentEpisodes from '../../anime/RecentEpisodes/page'
import { Suspense } from 'react'
import SearchEpisodes from '../../anime/SearchEpisodes/page'
import RecentMovies from '../../anime/RecentMovies/page'
import style from '../../../css/home.module.css'
import FetchPopular from '../../anime/Popular/page'
import LoadingComponent from '../../LoadingComponent/page'

const Anime: NextPage = () => {
  return (
    <div className={style.animeHome}>
      <Suspense fallback={
        <div
          style={{
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center'
          }}>
          <LoadingComponent />
        </div>
      } >
        <SearchEpisodes />
        <TopAiring />
        <FetchPopular />
        <RecentEpisodes />
        <RecentMovies />
      </Suspense>
    </div>
  )
}

export default Anime