"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
    const [imageLoadErrors, setImageLoadErrors] = useState<Record<number, boolean>>({});

    const animeData = useMemo(() => props?.info || [], [props?.info]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const bannerRef = useRef<HTMLDivElement | null>(null);

    const handleAutoTransition = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % animeData.length);
            setIsTransitioning(false);
        }, 500);
    }, [animeData.length, isTransitioning]);

    useEffect(() => {
        if (animeData.length > 0) {
            setIsLoading(false);
        }
        if (!bannerRef.current || animeData.length === 0) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.boundingClientRect.top <= 400) {
                    intervalRef.current = setInterval(() => {
                        handleAutoTransition();
                    }, 5000);
                } else {
                    // Stop interval if moved out
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            },
            {
                root: null,
                threshold: 0.8,
            }
        );

        observer.observe(bannerRef.current);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            observer.disconnect();
        };
    }, [animeData.length, handleAutoTransition]);


    const handleDotClick = useCallback((index: number) => {
        if (index !== currentIndex && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
            }, 300);
        }
    }, [currentIndex, isTransitioning]);

    const handleNext = useCallback(() => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % animeData.length);
                setIsTransitioning(false);
            }, 300);
        }
    }, [animeData.length, isTransitioning]);

    const handlePrev = useCallback(() => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev - 1 + animeData.length) % animeData.length);
                setIsTransitioning(false);
            }, 300);
        }
    }, [animeData.length, isTransitioning]);

    const handleImageError = useCallback((index: number) => {
        setImageLoadErrors(prev => ({ ...prev, [index]: true }));
    }, []);

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
        <div className={styles.bannerContainer} ref={bannerRef}>
            {/* Simplified Background Images */}
            <div className={styles.bannerBackground}>
                {animeData.map((anime: any, index: number) => (
                    <div
                        key={anime.id}
                        className={`
                            ${styles.bgImage} ${index === currentIndex ? styles.active : ''} 
                            ${isTransitioning ? styles.transitioning : ''}
                            `}
                        style={{
                            backgroundImage: !imageLoadErrors[index] ? `url(${currentAnime.url})` : 'none',
                            backgroundColor: imageLoadErrors[index] ? '#1a1a2e' : 'transparent'
                        }}
                    >
                        <div className={styles.bgOverlay}></div>
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
                                    <span className={styles.btnIcon}>▶</span>
                                    <span className={styles.btnText}>WATCH NOW</span>
                                </Link>
                            </div>

                            <div className={styles.animeBadges}>
                                <div className={styles.badge}>
                                    <Image src={cc} height={14} width={14} className={styles.badgeIcon} alt="Subtitles" />
                                    <span className={styles.badgeText}>{currentAnime.sub || 0} SUB</span>
                                </div>
                                <div className={styles.badge}>
                                    <Image src={dubcc} height={14} width={14} className={styles.badgeIcon} alt="Dubbed" />
                                    <span className={styles.badgeText}>{currentAnime.dub || 0} DUB</span>
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
                                    onError={() => handleImageError(currentIndex)}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className={styles.bannerControls}>
                    <div className={styles.controlsWrapper}>
                        <button
                            className={styles.navBtn}
                            onClick={handlePrev}
                            disabled={isTransitioning}
                            aria-label="Previous anime"
                        >
                            <span className={styles.navIcon}>‹</span>
                        </button>

                        <div className={styles.dotsContainer}>
                            {animeData.slice(0, animeData.length).map((_: any, index: number) => (
                                <button
                                    key={index}
                                    className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                                    onClick={() => handleDotClick(index)}
                                    disabled={isTransitioning}
                                    aria-label={`Go to anime ${index + 1}`}
                                >
                                    <div className={styles.dotCore}></div>
                                </button>
                            ))}
                        </div>

                        <button
                            className={styles.navBtn}
                            onClick={handleNext}
                            disabled={isTransitioning}
                            aria-label="Next anime"
                        >
                            <span className={styles.navIcon}>›</span>
                        </button>
                    </div>

                    {/* Simplified Progress Indicator */}
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
        </div>
    );
};

export default BannerContainer;