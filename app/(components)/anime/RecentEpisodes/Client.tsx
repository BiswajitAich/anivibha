import styles from "../../../css/recentEpisodes.module.css"
import Card from "../../cards/Card";
import { AnimePoster } from "@/app/utils/parsers/parse2";
const Client = ({ data, sel }: { data: AnimePoster[], sel: string | undefined }) => {
    return (
        <div className={styles.episodesDiv}>
            {data.map((anime: AnimePoster, idx: number) => (
                <Card anime={anime} sel={sel} key={`${idx}-${anime.id}-${anime.name}`} />
            ))}
        </div>
    );
};

export default Client;
