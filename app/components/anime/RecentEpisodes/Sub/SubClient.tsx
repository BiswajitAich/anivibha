// "use client"
import type { NextPage } from "next";
import style from "../../../../css/recentEpisodes.module.css"
import Link from "next/link";
import Image from "next/image";
interface episodeDataTypes {
    map: any
    id: string,
    title: string,
    image: string,
    episodeNumber: number,
    url: string,
    episodeId: string
}

const DubClient: NextPage<any> = ({ data }) => {


    return (
        <div className={style.episodesDiv}>
            {data?.results.map((episode: episodeDataTypes) => (
                <Link href={`/watch/${episode.id}`}
                    key={episode.episodeId}
                    className={style.episodes}>
                    <div >
                        <Image
                            src={episode.image}
                            alt={episode.title}
                            width={150}
                            height={200}
                        />
                    </div>
                    <p>{episode.title}</p>
                </Link>
            ))}
        </div>
    );
};

export default DubClient;

