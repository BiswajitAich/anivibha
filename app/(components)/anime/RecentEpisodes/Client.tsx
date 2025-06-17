import styles from "../../../css/recentEpisodes.module.css"
import Image from "next/image";
import Link from "next/link";
import { RecentAnime } from "@/app/utils/parsers/parse";
import microphone from "@/public/icons/microphone.svg";
import cc from "@/public/icons/subtitle.svg";
const Client = ({ data, sel }: {
    data: {
        currentPage: number,
        hasNextPage: number,
        results: RecentAnime[]
    }, sel?: string
}) => {
    const recentEpisodes = data?.results;
    return (
        <div className={styles.episodesDiv}>
            {recentEpisodes?.map((episode: RecentAnime) => (
                <Link href={{ pathname: `/watch/${episode.id}`, query: { type: sel } }}
                    key={episode.id}
                    className={styles.episodes}
                    title={episode.title}>
                    <div className={styles.imgCard}>
                        <Image
                            src={episode.image}
                            alt={episode.title}
                            width={150}
                            height={200}
                            className={styles.epImg}
                        />
                        <div className={styles.counts}>
                            <span className={styles.subCounts}>
                                <Image src={cc} height={18} width={18} alt="" />
                                {episode.sub}
                            </span>
                            <span className={styles.dubCounts}>
                                <Image src={microphone} height={18} width={18} alt="" />
                                {episode.dub}
                            </span>
                            <span className={styles.epsCounts}>
                                {episode.eps}
                            </span>
                        </div>
                    </div>
                    <p>{episode.title}</p>
                    <span className={styles.rate}>{episode.rate}</span>
                    <span className={styles.hover} />
                </Link>
            ))}
        </div>
    );
};

export default Client;
