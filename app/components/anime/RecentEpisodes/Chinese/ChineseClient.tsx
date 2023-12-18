// "use client"
import type { NextPage } from "next";
import style from "../../../../css/recentEpisodes.module.css"
import Image from "next/image";
import Link from "next/link";
interface episodeDataTypes {
    map: any
    id: string,
    title: string,
    image: string,
    episodeNumber: number,
    url: string,
    episodeId: string
}




const ChineseClient: NextPage<any> = async ({ data }) => {
    const recentEpisodes = data?.results;

    return (
        <div className={style.episodesDiv}>
            {recentEpisodes?.map((episode: episodeDataTypes) => (
                <Link href={`/watch/${episode.id}`}
                    key={episode.episodeId}
                    className={style.episodes}>
                    <div >
                        <Image
                            src={episode.image}
                            alt={episode.title}
                            width={200}
                            height={250}
                        />
                    </div>
                    <p>{episode.title}</p>
                </Link>
            ))}
        </div>
    );
};

export default ChineseClient;
