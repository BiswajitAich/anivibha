"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
                const response = await fetch(`https://anivibha.vercel.app/api/anime/FetchInfo?id=${Id}`);
                const data = await response.json();
                setInfo(data);
                // console.log("info", data);
                playEpisode(data.episodes[data.episodes.length-1].id);
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
                `https://anivibha.vercel.app/api/anime/FetchEpisodeServers?episodeId=${episodeId}`,
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
                    style={{ minWidth: '100vw', aspectRatio: '7/5', backgroundColor: 'black'}}
                    src={selectedServer}
                    allowFullScreen
                    title="Watch"
                ></iframe>

                    <h1>{info.title}</h1>

            {info.episodes.map((episode: episodeDataTypes) => (
                <button key={episode.id} onClick={() => playEpisode(episode.id)}>
                    <div>{episode.number}</div>
                </button>
            ))}
            <div>
                <h2>Servers</h2>
                {servers.map((server: episodeDataTypes, idx: number) => (
                    <button key={idx}
                        onClick={() => changeServer(server.url)}>
                        {server.name}
                    </button>
                ))}
            </div>
            <div>
                <p>GENRE</p>
                {info.genres.join(", ")}
            </div>
            <p>otherName: {info.otherName}</p>
            <p>releaseDate: {info.releaseDate}</p>
            <p>status: {info.status}</p>
            <p>subOrDub: {info.subOrDub}</p>
            <p>totalEpisodes: {info.totalEpisodes}</p>
            <p>description: {info.description}</p>
        </div>
    );
};
export default Watch;
