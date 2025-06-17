import { NextPage } from 'next';
// import TopAiring from '../../anime/TopAiringEpisodes/page';
import { Suspense } from 'react';
import style from '../../../css/home.module.css';
import LoadingComponent from '../../LoadingComponent/page';
import RecentEpisodes from '../../anime/RecentEpisodes/page';
import Banner from '../../anime/Banner/Banner';
import Header from './Header';
import CompletedEpisodes from '../../anime/Completed/page';

const Anime: NextPage = async () => {
  return (
    <>
      <Header />
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
          <Banner />
          {/* <TopAiring /> */}
          <div className={style.homeContainer}>
            <RecentEpisodes />
            <CompletedEpisodes />
          </div>
        </Suspense>
      </div>
    </>
  )
}

export default Anime