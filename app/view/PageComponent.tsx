import { AnimePoster } from "../utils/parsers/parse2";
import styles from '@/app/view/styles/PageComponent.module.css';
import Card from "../(components)/cards/Card";
import Link from "next/link";

const PageComponent = ({ data, path, page, language }: { data: AnimePoster[], path: string | undefined, page: string | undefined, language: number }) => {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.pageTitle}>Anime Page</h1>
            <div className={styles.gridContainer}>
                {data.map((anime, idx: number) => (
                    <Card anime={anime}
                        sel={Number(language) === 1 ? "sub" : (Number(language) === 2 ? "dub" : undefined)}
                        key={`${idx}-${anime.id}-${anime.name}`} />
                ))}
            </div>
            {path &&
                <div className={styles.pagination}>
                    <Link href={`/view${path}&page=${Number(page) - 1}`} className={`${styles.arrow} ${Number(page) <= 1 ? styles.disabled : ''}`} title='Previous page'>&#8592;</Link>
                    <span className={styles.currPage} title={`current page number ${page}`}>{page}</span>
                    <Link href={`/view${path}&page=${Number(page) + 1}`} className={styles.arrow} title="Next page">&#8594;</Link>
                </div>
            }
        </div>
    );
}

export default PageComponent;
