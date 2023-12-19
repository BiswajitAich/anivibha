"use client"
import { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import style from '../../../css/searchEpisodes.module.css'

interface searchedDataTypes {
    id: string,
    image: string,
    releaseDate: string,
    subOrDub: string,
    title: string,
    url: string,
}

const SearchEpisodes: NextPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchBtn, setSearchBtn] = useState([false, false]);
    const [searchedData, setSearchedData] = useState([]);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {

        if (searchValue.trim() === '') {
            const interValId = setTimeout(() => {
                setShowMessage(false);
            }, 5000)


            return () => clearTimeout(interValId);
        }
    }, [showMessage])



    useEffect(() => {

        const fetchData = async () => {
            if (searchValue.trim() !== '' && searchBtn[1] === true) {

                try {
                    const res = await fetch(`${window.location.origin}/api/anime/FetchSearchData`, {
                        method: "POST",
                        body: JSON.stringify({
                            query: searchValue,
                            page: "1"
                        })
                    })
                    const data = await res.json();
                    setSearchedData(data.results);
                    // console.log(data);
                } catch (error) {
                    console.log(error)
                }
                setSearchBtn([true, false]);
            }
        }
        fetchData();
    }, [searchValue, searchBtn])

    const handleSearchBtn = () => {
        if (searchValue.trim() === '') setShowMessage(true);

        if (searchBtn[0] === false && searchBtn[1] === false)
            setSearchBtn([true, false])

        else if (searchBtn[0] === true && searchBtn[1] === false)
            setSearchBtn([true, true])

        else if (searchBtn[0] === true && searchBtn[1] === true)
            setSearchBtn([false, false])
    }

    const handleClear = () => {
        setSearchBtn([false, false]);
        setSearchedData([]);
    }

    return (
        <>
            <header className={style.header}>
                <div className={style.logoDiv}>
                    <Image src={require("../../../../public/anivibha-logo.png")}
                        width={200}
                        height={200}
                        alt="anivibha logo"
                    />
                </div>

                <button onClick={handleSearchBtn}>&#128269;</button>
            </header>


            <div className={style.inputDiv}>
                {showMessage && searchBtn[1] === true ? (<span>Enter anime name to search !</span>) : null}
                {searchBtn[0] === true ? (
                    <div>
                        <input type="text"
                            placeholder="Search here"
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                ) : null}
                {searchBtn[0] === true ? (
                    <button onClick={handleClear}>&#10006;</button>
                ) : null}
            </div>


            {searchedData.length >= 1 ? (
                <div className={style.foundAnime}>
                    <div className={style.foundAnimeDiv}>
                        {searchedData?.map((anime: searchedDataTypes) => (
                            <div key={anime.id} className={style.foundAnimeEpisodes}>
                                <Link href={`/watch/${anime.id}`} >
                                    <Image
                                        src={anime.image}
                                        height={180}
                                        width={130}
                                        alt={anime.id}
                                    />
                                    <div className={style.foundData}>
                                        <p>{anime.title}</p>
                                        <p>{anime.subOrDub}</p>
                                        <p>{anime.releaseDate}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                </div>
            ) : null}
        </>
    )
}

export default SearchEpisodes
