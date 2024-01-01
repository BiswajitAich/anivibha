'use client'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import style from '../../../css/popular.module.css'

interface popularDataProps {
    id: string,
    image: string,
    releaseDate?: string,
    title: string,
}

const PopularClient: NextPage<any> = ({ data }) => {
    const [popularData, setPopularData] = useState<any>(data);
    const [hidePrevBtn, setHidePrevBtn] = useState<boolean>(true);
    const [hideNxtBtn, setHideNxtBtn] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const handlePrevBtn = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 200;
            setHidePrevBtn(containerRef.current.scrollLeft < 50);
            setHideNxtBtn(false);
        }
    };

    const handleNxtBtn = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 200;
            setHidePrevBtn(false);
            setHideNxtBtn(containerRef.current.scrollWidth - containerRef.current.offsetWidth - containerRef.current.scrollLeft < 50);
        }
    };

    return (
        <div className={style.container}>
            <h3>
                Popular
                {!hidePrevBtn && (
                    <button className={style.prevBtn} onClick={handlePrevBtn}>
                        &#9664;
                    </button>
                )}
                {!hideNxtBtn && (
                    <button className={style.nxtBtn} onClick={handleNxtBtn}>
                        &#9654;
                    </button>
                )}
            </h3>
            <div className={style.cardBody} ref={containerRef}>
                {popularData?.results.map((anime: popularDataProps, idx: number) => (
                    <div
                        style={{ backgroundImage: `url(${anime.image})` }}
                        className={style.card}
                        key={anime.id}
                    >
                        <Link href={`/watch/${anime.id}`}>
                            <div>
                                <Image
                                    src={anime.image}
                                    alt={anime.title}
                                    width={120}
                                    height={160}
                                />
                            </div>
                            <div className={style.data}>
                                {anime?.title && <p>{anime.title}</p>}
                                {anime?.releaseDate && <p>Year: {anime.releaseDate}</p>}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularClient;
