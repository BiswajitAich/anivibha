import { NextPage } from 'next';
// import TopAiring from '../../anime/TopAiringEpisodes/page';
import { Suspense } from 'react';
import style from '@/app/home/styles/home.module.css';
import LoadingComponent from '../(components)/LoadingComponent/page';
import RecentEpisodes from '../(components)/anime/RecentEpisodes/page';
import Banner from '../(components)/anime/Banner/Banner';
import CompletedEpisodes from '../(components)/anime/Completed/page';

import dynamic from 'next/dynamic';
const Header = dynamic(()=>import('../(components)/header/Header'));
const Footer = dynamic(()=>import('../(components)/footer/Footer'));

const Anime: NextPage = async () => {
  return (
    <>
      <div className={style.animeHome}>
        <Header />
        <Suspense fallback={
          <LoadingComponent />
        } >
          <Banner />
          {/* <TopAiring /> */}
          <div className={style.homeContainer}>
            <RecentEpisodes />
            <CompletedEpisodes />
          </div>
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

export default Anime