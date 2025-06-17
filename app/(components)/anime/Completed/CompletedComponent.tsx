import { AnimePoster } from "@/app/utils/parsers/parse2";
import styles from '@/app/css/CompletedComponent.module.css';
import Image from "next/image";
import cc from "@/public/icons/subtitle.svg";
import micriphone from "@/public/icons/microphone.svg";
import Link from "next/link";
const CompletedComponent = ({ info }: { info: AnimePoster[] }) => {

    return (
        <div className={styles.container}>
            {/* Header with title + tabs */}
            <div className={styles.header}>
                <div className={styles.headerTitle}>RECENTLY COMPLETE</div>
            </div>

            {/* List */}
            <div className={styles.list}>
                {info.map((item, idx) => (
                    <Link href={`/watch/${item.animeId}`} key={idx} className={styles.itemClass} title={item.name}>
                        <div className={styles.rank}>{idx + 1}</div>
                        <div className={styles.thumbnailWrapper}>
                            <img
                                src={item.url}
                                alt={item.name}
                                className={styles.thumbnail}
                            />
                        </div>
                        <div className={styles.info}>
                            <div className={styles.itemTitle} title={item.name}>
                                {item.name}
                            </div>
                            <span className={styles.extraInfo}>
                                {item.sub &&
                                    <span className={styles.subCount}>
                                        <Image
                                            src={cc}
                                            height={15}
                                            width={15}
                                            alt=""
                                        />
                                        {item.sub}
                                    </span >
                                }
                                {item.dub &&
                                    <span className={styles.dubCount}>
                                        <Image
                                            src={micriphone}
                                            height={15}
                                            width={15}
                                            alt=""
                                        />
                                        {item.dub}
                                    </span>
                                }
                                {item.eps && <span className={styles.epsCount}>{item.eps}</span>}
                                {item.itemType && <span className={styles.dot} />}
                                {item.itemType && <span className={styles.itemType}>{item.itemType}</span>}
                                {item.eps && <span className={styles.dot} />}
                                {item.eps && <span className={styles.epsCount}>{item.eps}</span>}
                                {item.duration && <span className={styles.dot} />}
                                {item.duration && <span className={styles.duration}>{item.duration}</span>}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};


export default CompletedComponent;