import { AnimePoster } from "@/app/utils/parsers/parse2";
import Image from "next/image";
import styles from '@/app/(components)/cards/styles/Card.module.css';
import cc from "@/public/icons/subtitle.svg";
import microphone from "@/public/icons/microphone.svg";
import Link from "next/link";
const Card = ({ anime, sel }: { anime: AnimePoster, sel: string|undefined }) => {
    return (
        <Link href={{ pathname: `/watch/${anime.animeId}`, query: { type: sel }}} className={styles.card} title={anime.name}>
            <div className={styles.imageWrapper}>
                <Image
                    src={anime.url}
                    alt={anime.name}
                    height={300}
                    width={200}
                    loading="lazy"
                    className={styles.image}
                />
                {anime.rate && (
                    <p className={styles.rate}>{anime.rate}</p>
                )}
                <div className={styles.recGlow}></div>
            </div>
            <div className={styles.info}>
                <h2 className={styles.name}>{anime.name}</h2>
                {anime.JapaneseName && anime.JapaneseName !== anime.name && (
                    <p className={styles.jpName} title={anime.JapaneseName}>{anime.JapaneseName}</p>
                )}
                <div className={styles.meta}>
                    {anime.itemType && (
                        <span className={styles.type}>{anime.itemType}</span>
                    )}
                    {anime.duration && (
                        <span className={styles.duration}>{anime.duration}</span>
                    )}
                </div>
                <div className={styles.ratings}>
                    <span className={styles.sub}>
                        <Image
                            src={cc}
                            height={15}
                            width={15}
                            alt="Sub"
                        />
                        : {anime.sub || 'N/A'}</span>
                    <span className={styles.dub}>
                        <Image
                            src={microphone}
                            height={15}
                            width={15}
                            alt="Dub"
                        />
                        : {anime.dub || 'N/A'}</span>
                    {anime.eps && (
                        <p className={styles.eps}>eps:{anime.eps}</p>
                    )}
                </div>

            </div>

        </Link>
    );
}

export default Card;