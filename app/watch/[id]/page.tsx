"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "../../css/watch.module.css"
import Image from "next/image";
import Link from "next/link";
import LoadingComponent from "@/app/components/LoadingComponent/page";

interface episodeDataTypes {
    map: any
    id: string,
    title: string,
    image: string,
    number: number,
    url: string,
    episodeId: string
    name: string
}
const Watch = () => {
    const params = useParams();


    const [dubinfo, setDubInfo] = useState<any>({
        episodes: [],
        genres: [],
        fetched: false,
    });
    const [subinfo, setSubInfo] = useState<any>({
        episodes: [],
        genres: [],
        fetched: false,
    });
    const [servers, setServers] = useState<any>([]);
    const [selectedServer, setSelectedServer] = useState<any>();
    const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
    const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState<number | null>(null);
    const [selectedEpisodeSub, setSelectedEpisodeSub] = useState<string | null>(null);
    const [selectedEpisodeDub, setSelectedEpisodeDub] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [subOrDub, setSubOrDub] = useState<string>('');

    let controller: AbortController | null = null;
    const fetchData = async (Id: string) => {
        setLoading(true);

        try {
            if (dubinfo.fetched && subinfo.fetched) {
                return;
            }
            controller = new AbortController();
            const signal = controller.signal;
            const response = await fetch(`${window.location.origin}/api/anime/FetchInfo?id=${Id}`,
                { signal }
            );
            const data = await response.json();

            if (data.id.endsWith('-dub')) {
                setDubInfo({ ...data, fetched: true });
            } else {
                setSubInfo({ ...data, fetched: true });
            }
            console.log("info", data);
            // const selectedEpisode = data.episodes[data.episodes.length - 1].id;
            // playEpisode(selectedEpisode);
            // setSelectedEpisode(selectedEpisode);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            if (controller) {
                controller.abort();
                controller = null;
            }
        }
    }
    useEffect(() => {
        const Id = encodeURIComponent(params.id as string);
        fetchData(Id);
    }, [params.id]);

    useEffect(() => {
        if (dubinfo.id) {
            processId();
        }
    }, [dubinfo.id]);

    const viewHistory = (episode?: string) => {
        if (params.id) {
            const storedHistoryString = localStorage.getItem('viewHistory');
            const storedHistory = storedHistoryString ? JSON.parse(storedHistoryString) : {};
            const viewHistory = { ...storedHistory };
            const episodeId = encodeURIComponent(params.id as string);
            const Id = episodeId.split('-episode-')[0];
            const existingEntry = viewHistory[Id] || {};
    
            if (episode) {
                const { sub, dub } = existingEntry;
                if (subOrDub === 'dub') {
                    viewHistory[Id] = {
                        sub: sub || episode,
                        dub: episode
                    };
                } else {
                    viewHistory[Id] = {
                        sub: episode,
                        dub: dub || episode
                    };
                }
    
                setSelectedEpisode(episode);
                playEpisode(episode);
            } else {
                const { sub, dub } = existingEntry;
                if (!sub || !dub) {
                    const latestDubEpisodeId = dubinfo?.episodes[dubinfo.episodes.length - 1]?.id;
                    const latestSubEpisodeId = subinfo?.episodes[subinfo.episodes.length - 1]?.id;
    
                    viewHistory[Id] = {
                        sub: sub || latestSubEpisodeId,
                        dub: dub || latestDubEpisodeId
                    };
    
                    setSelectedEpisode(subOrDub === 'dub' ? viewHistory[Id].dub : viewHistory[Id].sub);
                    playEpisode(subOrDub === 'dub' ? viewHistory[Id].dub : viewHistory[Id].sub);
                } else {
                    setSelectedEpisode(subOrDub === 'dub' ? dub : sub);
                    playEpisode(subOrDub === 'dub' ? dub : sub);
                }
            }
    
            localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
        }
    };
        

    useEffect(() => {
        viewHistory();
    }, [dubinfo, subinfo, subOrDub]);

    useEffect(() => {
        if (selectedEpisode) {
            const parts = selectedEpisode.split('-');
            const lastPart = parts[parts.length - 1];
            const num = parseInt(lastPart, 10);
            setSelectedEpisodeNumber(num);
        }
    }, [selectedEpisode]);

    const processId = () => {
        if (dubinfo.id.endsWith('-dub')) {
            setSubOrDub('dub');
            setSelectedEpisodeSub(dubinfo.id.replace('-dub', ''));
            setSelectedEpisodeDub(dubinfo.id);
        } else {
            setSubOrDub('sub');
            setSelectedEpisodeDub(dubinfo.id + '-dub');
            setSelectedEpisodeSub(dubinfo.id);
        }

    }

    const playEpisode = async (id: string) => {
        try {
            const episodeId = id as string;
            // console.log('episodeId', episodeId)
            const response = await fetch(
                `${window.location.origin}/api/anime/FetchEpisodeServers?episodeId=${episodeId}`,
            );
            const data = await response.json();
            // console.log(data)
            setServers(data);
            setSelectedServer(data[0]?.url);
        } catch (error) {
            console.error('Failed to fetch episode servers:', error);
        }
    };



    const changeServer = (server: string) => {
        setSelectedServer(server);
        // console.log(selectedServer)
    };


    const setSelectedEpisodeId = (episode: any) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // setSelectedEpisode(episode)
        // playEpisode(episode)
        viewHistory(episode);
    }

    const handleSubOrDub = (sORd: string) => {

        if (selectedEpisodeSub && selectedEpisodeDub) {

            if (sORd === 'sub') {
                fetchData(selectedEpisodeSub);
                setSubOrDub('sub');
            } else if (sORd === 'dub') {
                fetchData(selectedEpisodeDub);
                setSubOrDub('dub');
            }
        }
        viewHistory();
    }

    return (
        <div className={style.watchContainer}>
            <header className={style.header}>
                <Link href="/components/home/Anime" className={style.logo}>
                    <Image
                        src={require("../../../public/anivibha-logo.png")}
                        width={200}
                        height={200}
                        alt="logo" />
                </Link>
            </header>
            <iframe
                referrerPolicy="no-referrer"
                width="100%"
                height="100%"
                style={{ aspectRatio: '7/5', backgroundColor: 'black', border: "0" }}
                src={selectedServer}
                allowFullScreen
                title="Watch now"
                // sandbox="allow-orientation-lock allow-modals allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
                allow="encrypted-media; gyroscope; picture-in-picture; fullscreen"
            >Sorry 😭 !</iframe>


            {loading ? (
                <div
                    style={{
                        minHeight: '50vh',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                    <LoadingComponent />
                </div>
            ) : (<>


                <h1>{subOrDub === 'dub' ? dubinfo.title : subinfo.title}</h1>
                <p className={style.ps} style={{ fontSize: '12px' }}>You are watching episode number :
                    <span style={{ color: 'chartreuse' }}> {selectedEpisodeNumber}</span>
                </p>
                <p className={style.ps}>Episodes:
                    {selectedEpisodeSub ? (<button
                        className={style.typeBtn}
                        style={{
                            backgroundColor: subOrDub === 'sub' ? 'cyan' : '',
                            color: subOrDub === 'sub' ? 'black' : ''
                        }}
                        onClick={() => handleSubOrDub('sub')}
                    >
                        SUB
                    </button>
                    ) : null}
                    {selectedEpisodeDub ? (<button
                        className={style.typeBtn}
                        style={{
                            backgroundColor: subOrDub === 'dub' ? 'cyan' : '',
                            color: subOrDub === 'dub' ? 'black' : ''
                        }}
                        onClick={() => handleSubOrDub('dub')}
                    >
                        DUB
                    </button>
                    ) : null}
                </p>
                <div className={style.episodeBtnsDiv}>
                    {subOrDub === 'dub' ?
                        dubinfo.episodes.map((episode: episodeDataTypes) => (
                            <button
                                key={episode.id}
                                onClick={() => setSelectedEpisodeId(episode.id)}
                                style={{
                                    background: selectedEpisode === episode.id ?
                                        'linear-gradient(45deg, rgb(114 58 107), #ff00b1fc, rgb(114 58 107)' :
                                        "black"
                                }}
                            >
                                {episode.number}
                            </button>
                        )) :
                        subinfo.episodes.map((episode: episodeDataTypes) => (
                            <button
                                key={episode.id}
                                onClick={() => setSelectedEpisodeId(episode.id)}
                                style={{
                                    background: selectedEpisode === episode.id ?
                                        'linear-gradient(45deg, rgb(114 58 107), #ff00b1fc, rgb(114 58 107)' :
                                        "black"
                                }}
                            >
                                {episode.number}
                            </button>
                        ))
                    }

                </div>
                <div className={style.infos}
                    style={{ backgroundImage: `url(${subOrDub === 'dub' ? dubinfo.image : subinfo.image})` }}>
                    <p className={style.ps}>Servers:</p>
                    <div className={style.serverBtnsDiv}>
                        {servers.map((server: episodeDataTypes, idx: number) => (
                            <button key={idx}
                                onClick={() => changeServer(server.url)}
                                style={{ background: selectedServer === server.url ? 'rgba(255, 0, 170, 0.5)' : '' }}
                            >
                                {server.name}
                            </button>
                        ))}
                    </div>
                    <p className={style.ps}>GENRE:</p>
                    <div className={style.episodeGenres}>
                        {subOrDub === 'dub' ? dubinfo.genres : subinfo.genres.join(", ")}
                    </div>
                    <p className={style.ps}>otherName: </p>
                    <div className={style.otherName}>
                        <span>{subOrDub === 'dub' ? dubinfo.otherName : subinfo.otherName}</span>
                    </div>
                    <p className={style.ps}>releaseDate: </p>
                    <div className={style.releaseDate}>
                        <span>{subOrDub === 'dub' ? dubinfo.releaseDate : subinfo.releaseDate}</span>
                    </div>
                    <p className={style.ps}>status: </p>
                    <div className={style.status}>
                        <span>{subOrDub === 'dub' ? dubinfo.status : subinfo.status}</span>
                    </div>
                    <p className={style.ps}>subOrDub: </p>
                    <div className={style.subOrDub}>
                        <span>{subOrDub === 'dub' ? dubinfo.subOrDub : subinfo.subOrDub}</span>
                    </div>
                    <p className={style.ps}>totalEpisodes: </p>
                    <div className={style.totalEpisodes}>
                        <span>{subOrDub === 'dub' ? dubinfo.totalEpisodes : subinfo.totalEpisodes}</span>
                    </div>
                </div>
                <p className={style.ps}>description: </p>
                <div className={style.description}>
                    <span>{subOrDub === 'dub' ? dubinfo.description : subinfo.description}</span>
                </div>


            </>)}



        </div>
    );
};
export default Watch;
