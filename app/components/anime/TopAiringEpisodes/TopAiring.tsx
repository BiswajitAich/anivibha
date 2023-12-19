"use client"
import Link from "next/link";
import style from "@/app/css/topAiring.module.css"
import { useEffect, useState } from "react";
import { NextPage } from "next";

interface dataType {
  id: string,
  image: string,
  title: string,
  genres: string[],
}
const TopAiring: NextPage<any> = ({data}) => {

  const airingData = data?.results
  const [isHovered, setIsHovered] = useState(false);
  const [current, setCurrent] = useState<number>(0);


  // useEffect(() => {
  // setAiringData(data?.results);
  // console.log(data)
  // },[airingData])


  useEffect(() => {
    const interval = setInterval(() => {

      if (!isHovered) {
        setCurrent((prev) => {
          if (prev >= airingData?.length - 1) return 0;
          return prev + 1
        })
      }
    }, 4000)

    return () => {
      clearInterval(interval);
    }
  }, [isHovered, current, airingData?.length])

  const slideLeft = () => {
    setCurrent((prev) => {
      if (prev <= 0) return airingData?.length - 1;
      return prev - 1
    })
  }

  const slideRight = () => {
    setCurrent((prev) => {
      if (prev >= airingData?.length - 1) return 0;
      return prev + 1
    })

  }

  return (
    <div>
      <div style={{minWidth: '100%', minHeight: '50px', background: 'transparent'}}/>
      {/* <h2>TopAiring</h2> */}
      {airingData ? (
        <div className={style.carousel}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={style.carouselWraper}>

            {airingData.map((item: dataType, idx: number) => (
              <Link href={`/watch/${item.id}`}
                key={idx}
                className={idx === current ? `${style.carouselCard} ${style.carouselCardActive}` : `${style.carouselCard}`}>
                <img src={item.image} alt={item.title} height={400} width={350} />
                <div className={style.cardOverlay}>
                  <p style={{ color: "cyan" }}>Title:</p> {item.title}
                  <p style={{ color: "cyan" }}>Genres:</p> {item.genres.join(",")}
                </div>
              </Link>
            ))}
          </div>
          <button onClick={slideLeft} className={style.buttonPrev}>&#9664;</button>
          <button onClick={slideRight} className={style.buttonNext}>&#9654;</button>
        </div>
      ) : null
      }
    </div>
  )
};

export default TopAiring