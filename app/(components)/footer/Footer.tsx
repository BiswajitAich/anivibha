'use client';

import styles from './styles/Footer.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import animeGif from '@/public/dance.gif';

const Footer = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <h2 className={styles.title}>Explore the Anime Multiverse</h2>
                    <p className={styles.description}>Powered by Neon, fueled by Cosmos. Watch, wonder, repeat.</p>
                </div>
                <div className={styles.right}>
                    <Image src={animeGif} alt="Anime Character" className={styles.gif} />
                </div>
            </div>

            {showTopBtn && (
                <button className={styles.topBtn} onClick={scrollToTop}>
                    ↑ Top
                </button>
            )}
        </footer>
    );
};

export default Footer;
