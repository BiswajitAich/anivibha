"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "../../css/watch.module.css"

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


    const [info, setInfo] = useState<any>({
        episodes: [],
        genres: [],
    });
    const [servers, setServers] = useState<any>([]);
    const [selectedServer, setSelectedServer] = useState<any>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const Id = encodeURIComponent(params.id as string);
                const response = await fetch(`${window.location.origin}/api/anime/FetchInfo?id=${Id}`);
                const data = await response.json();
                setInfo(data);
                // console.log("info", data);
                playEpisode(data.episodes[data.episodes.length - 1].id);
            } catch (error) {
                console.error(error);
            };
        }
        fetchData();
    }, [params.id]);

    const playEpisode = async (id: string) => {
        try {
            const episodeId = id as string;
            const response = await fetch(
                `${window.location.origin}/api/anime/FetchEpisodeServers?episodeId=${episodeId}`,
            );
            const data = await response.json();
            console.log(data)
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
    return (
        <div>

            <iframe
                referrerPolicy="no-referrer"
                width="100%"
                height="100%"
                style={{ minWidth: '100vw', aspectRatio: '7/5', backgroundColor: 'black', border: "0" }}
                src={selectedServer}
                allowFullScreen
                title="Watch now"
                // sandbox="allow-same-origin allow-scripts"
                allow="encrypted-media; gyroscope; picture-in-picture"
            >Sorry 😭 !</iframe>

            <h1>{info.title}</h1>
            <p className={style.ps}>Episodes:</p>
            <div className={style.episodeBtnsDiv}>
                {info.episodes.map((episode: episodeDataTypes) => (
                    <button key={episode.id} onClick={() => playEpisode(episode.id)}>
                        <div>{episode.number}</div>
                    </button>
                ))}
            </div>
            <p className={style.ps}>Servers:</p>
            <div className={style.serverBtnsDiv}>
                {servers.map((server: episodeDataTypes, idx: number) => (
                    <button key={idx}
                        onClick={() => changeServer(server.url)}>
                        {server.name}
                    </button>
                ))}
            </div>
            <p className={style.ps}>GENRE:</p>
            <div className={style.episodeGenres}>
                {info.genres.join(", ")}
            </div>
            <p className={style.ps}>otherName: </p>
            <div className={style.otherName}>
                <span>{info.otherName}</span>
            </div>
            <p className={style.ps}>releaseDate: </p>
            <div className={style.releaseDate}>
                <span>{info.releaseDate}</span>
            </div>
            <p className={style.ps}>status: </p>
            <div className={style.status}>
                <span>{info.status}</span>
            </div>
            <p className={style.ps}>subOrDub: </p>
            <div className={style.subOrDub}>
                <span>{info.subOrDub}</span>
            </div>
            <p className={style.ps}>totalEpisodes: </p>
            <div className={style.totalEpisodes}>
                <span>{info.totalEpisodes}</span>
            </div>
            <p className={style.ps}>description: </p>
            <div className={style.description}>
                <span>{info.description}</span>
            </div>
        </div>
    );
};
export default Watch;
