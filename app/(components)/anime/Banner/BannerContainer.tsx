"use client";
import { useState, useEffect } from 'react';
import styles from "@/app/css/bannerContainer.module.css";
import dubcc from "@/public/icons/microphone.svg";
import cc from "@/public/icons/subtitle.svg";
import Image from 'next/image';
import Link from 'next/link';
import LoadingComponent from '../../LoadingComponent/page';

const BannerContainer = ({ props }: { props: any }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const animeData = props?.info || [];

    useEffect(() => {
        if (animeData.length > 0) {
            setIsLoading(false);
            const interval = setInterval(() => {
                handleAutoTransition();
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [animeData.length]);

    const handleAutoTransition = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % animeData.length);
            setIsTransitioning(false);
        }, 300);
    };

    const handleDotClick = (index: number) => {
        if (index !== currentIndex) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const handleNext = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % animeData.length);
            setIsTransitioning(false);
        }, 300);
    };

    const handlePrev = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + animeData.length) % animeData.length);
            setIsTransitioning(false);
        }, 300);
    };

    if (isLoading || animeData.length === 0) {
        return (
            <div className={styles.bannerContainer}>
                <div className={styles.loadingSkeleton}>
                    <LoadingComponent />
                </div>
            </div>
        );
    }

    const currentAnime = animeData[currentIndex];

    return (
        <div className={styles.bannerContainer}>
            {/* Animated Background Particles */}
            <div className={styles.particleField}>
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className={`${styles.particle} ${styles[`particle${i % 4}`]}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${4 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Background Images with Enhanced Transitions */}
            <div className={styles.bannerBackground}>
                {animeData.map((anime: any, index: number) => (
                    <div
                        key={anime.id}
                        className={`${styles.bgImage} ${
                            index === currentIndex ? styles.active : ''
                        } ${isTransitioning ? styles.transitioning : ''}`}
                        style={{ backgroundImage: `url(${anime.url})` }}
                    >
                        <div className={styles.bgOverlay}></div>
                        <div className={styles.scanlines}></div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className={styles.bannerContent}>
                <div className={styles.contentWrapper}>
                    {/* Left Side - Anime Info */}
                    <div className={`${styles.animeInfo} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                        <div className={styles.infoPanel}>
                            <div className={styles.panelHeader}>
                                <div className={styles.statusIndicator}></div>
                                <span className={styles.panelTitle}>NOW STREAMING</span>
                            </div>

                            <h1 className={styles.animeTitle}>
                                <span className={styles.titleMain}>{currentAnime.name}</span>
                                {currentAnime.JapaneseName && (
                                    <span className={styles.titleJapanese}>{currentAnime.JapaneseName}</span>
                                )}
                            </h1>

                            <div className={styles.animeMeta}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>TYPE</span>
                                    <span className={styles.metaValue}>TV Series</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>STATUS</span>
                                    <span className={styles.metaValue}>Ongoing</span>
                                </div>
                            </div>

                            <div className={styles.animeActions}>
                                <Link href={{ pathname: `/watch/${currentAnime.animeId}` }} className={styles.btnPrimary}>
                                    <div className={styles.btnGlow}></div>
                                    <span className={styles.btnIcon}>▶</span>
                                    <span className={styles.btnText}>INITIATE STREAM</span>
                                </Link>
                                {/* <button className={styles.btnSecondary}>
                                    <span className={styles.btnIcon}>+</span>
                                    <span className={styles.btnText}>ADD TO QUEUE</span>
                                </button> */}
                            </div>

                            <div className={styles.animeBadges}>
                                <div className={styles.badge}>
                                    <Image src={cc} height={16} width={16} className={styles.badgeIcon} alt="" />
                                    <span className={styles.badgeText}>{currentAnime.sub} SUB</span>
                                </div>
                                <div className={styles.badge}>
                                    <Image src={dubcc} height={16} width={16} className={styles.badgeIcon} alt="" />
                                    <span className={styles.badgeText}>{currentAnime.dub} DUB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Anime Poster */}
                    <div className={`${styles.animePoster} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                        <div className={styles.posterContainer}>
                            <div className={styles.posterFrame}>
                                <img
                                    src={currentAnime.url}
                                    alt={currentAnime.name}
                                    className={styles.posterImage}
                                />
                                {/* <div className={styles.posterOverlay}>
                                    <div className={styles.scanEffect}></div>
                                </div> */}
                            </div>
                            {/* <div className={styles.posterGlow}></div> */}
                            <div className={styles.hologramEffect}></div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Navigation Controls */}
                <div className={styles.bannerControls}>
                    <div className={styles.controlsWrapper}>
                        <button className={styles.navBtn} onClick={handlePrev}>
                            <span className={styles.navIcon}>‹</span>
                        </button>

                        <div className={styles.dotsContainer}>
                            {animeData.map((_: any, index: number) => (
                                <button
                                    key={index}
                                    className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                                    onClick={() => handleDotClick(index)}
                                >
                                    <div className={styles.dotCore}></div>
                                </button>
                            ))}
                        </div>

                        <button className={styles.navBtn} onClick={handleNext}>
                            <span className={styles.navIcon}>›</span>
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{
                                    width: `${((currentIndex + 1) / animeData.length) * 100}%`
                                }}
                            ></div>
                        </div>
                        <div className={styles.progressText}>
                            {String(currentIndex + 1).padStart(2, '0')} / {String(animeData.length).padStart(2, '0')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Futuristic HUD Elements */}
            <div className={styles.hudOverlay}>
                <div className={styles.hudCorner} data-position="top-left"></div>
                <div className={styles.hudCorner} data-position="top-right"></div>
                <div className={styles.hudCorner} data-position="bottom-left"></div>
                <div className={styles.hudCorner} data-position="bottom-right"></div>
            </div>
        </div>
    );
};

export default BannerContainer;