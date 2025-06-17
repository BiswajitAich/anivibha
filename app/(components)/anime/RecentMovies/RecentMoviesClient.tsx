"use client"
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import style from '../../../css/recentMovies.module.css'

interface movieProps{
  id: string,
  releaseDate: string,
  image: string,
  title: string,
  url: string,
}

const RecentMoviesClient:NextPage<any> = ({data}) => {
  const [movieData, setMovieData] = useState<any>([])
  useEffect(() => {
    
    setMovieData(data)
 
    // console.log(data)
  }, [])
  
  return (
    <div className={style.movieContainer}>
      <h3>Recent Movies</h3>
      <div className={style.movieDiv}>
        {
          movieData?.results?.map((movie:movieProps) =>(
            <div key={movie.id} className={style.movieCatd}>
              <Link href={`/watch/${movie.id}`} >
                <div>
                  <Image src={movie.image} alt={movie.title} width={150} height={200} />
                  <div className={style.movieData}>
                    <p>{movie.title}</p>
                    <br/>
                    <p>{movie.releaseDate}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default RecentMoviesClient