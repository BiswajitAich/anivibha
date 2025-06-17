import SearchEpisodes from "../../anime/SearchEpisodes";
import styles from "@/app/css/header.module.css";
import logo from '@/public/anivibha-logo.png';
import Image from 'next/image';
import Link from 'next/link';
const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <Link href={'/home'}>
                    <div className={styles.logo}>
                        <Image
                            src={logo}
                            height={200}
                            width={200}
                            alt='Anivibha'
                            title='Anivibha logo'
                        />
                    </div>
                </Link>
                <SearchEpisodes />
            </div>
            <span className={styles.headerLine}/>
        </div>
    );
}

export default Header;