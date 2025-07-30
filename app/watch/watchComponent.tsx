"use client";
import styles from "./styles/watch.module.css";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingComponent from "@/app/(components)/LoadingComponent/page";
import LoadingText from "@/app/(components)/LoadingComponent/LoadingText";
import {
  Episode,
  RecommendedItem,
  SeriesInfo,
} from "@/app/api/types/seriesInfo";
// images
import playBtn from "@/public/icons/play-button.svg";
import subtitle from "@/public/icons/subtitle.svg";
import microphone from "@/public/icons/microphone.svg";

import axios from "axios";
import { Servers } from "@/app/api/types/servers";
import { initializeConsoleProtection } from "../utils/protection/consoleProtection";

const WatchComponent = ({
  info,
  type,
  paramsId,
}: {
  info: SeriesInfo;
  type: string | undefined;
  paramsId: string;
}) => {
  const IFRAME_URL = process.env.NEXT_PUBLIC_IFRAME_URL;
  const [servers, setServers] = useState<Servers>();
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState<
    number | null
  >(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [subOrDub, setSubOrDub] = useState<string>("sub");
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [seeMoreOrLess, setSeeMoreOrLess] = useState<{
    [key: string]: boolean;
  }>({});

  const groupSize: number = 10;
  const [groupIndex, setGroupIndex] = useState<number>(0);

  // to prevent memory leaks
  const controllerServersRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'production') {
    initializeConsoleProtection();
    // }
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [info]);

  // Fixed groups calculation with proper memoization
  const groups = useMemo(() => {
    if (!info.episodes || info.episodes.length === 0) return [];

    const arr = [];
    for (let i = 0; i < info.episodes.length; i += groupSize) {
      arr.push(info.episodes.slice(i, i + groupSize));
    }
    return arr;
  }, [info.episodes, groupSize]);

  const totalGroups = groups.length;

  // for localStorage with error handling
  const setHistory = useCallback((sub_dub: string) => {
    try {
      localStorage.setItem("subDubHistory", JSON.stringify(sub_dub));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }, []);

  const getHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem("subDubHistory");
      return stored ? JSON.parse(stored) : "sub";
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return "sub";
    }
  }, []);

  // Fixed episode navigation logic with debouncing
  useEffect(() => {
    if (!inputValue || inputValue.trim() === "") return;

    const episodeNum = parseInt(inputValue);
    if (isNaN(episodeNum) || episodeNum < 1 || episodeNum > info.totalItems) {
      return;
    }

    const handler = setTimeout(() => {
      const groupIdx = Math.floor((episodeNum - 1) / groupSize);
      if (groupIdx >= 0 && groupIdx < totalGroups && groupIndex !== groupIdx) {
        setGroupIndex(groupIdx);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, info.totalItems, totalGroups, groupIndex]);

  // Function to fetch all available episode servers
  const fetchServers = async (episodeId: string) => {
    try {
      // Cancel previous request
      if (controllerServersRef.current) {
        controllerServersRef.current.abort();
      }

      controllerServersRef.current = new AbortController();
      const signal = controllerServersRef.current.signal;

      const fullEpisodeId = `${paramsId}?ep=${episodeId}`;
      console.log("Fetching servers for:", fullEpisodeId);

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/anime/FetchServers?episodeId=${fullEpisodeId}`,
        { signal }
      );

      setServers(data);
      console.log("Servers data:", data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Servers request canceled");
      } else {
        console.error("Error while fetching servers:", error);
      }
      // Reset video source when servers fetch fails
      setVideoSource(null);
    }
  };

  const fetchVideoSource = async () => {
    if (selectedEpisodeId && subOrDub) {
      setVideoSource(`${IFRAME_URL}/${selectedEpisodeId}/${subOrDub}`);
    } else {
      setVideoSource(null);
    }
  };

  // Fixed episode selection logic
  const handleEpisodeSelect = (episode: Episode) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    console.log(servers);
    setSelectedEpisodeId(episode.id);
    setSelectedEpisodeNumber(episode.number);
    setVideoSource(null); // Reset video source when selecting new episode

    if (episode.id) {
      fetchServers(episode.id);
      if (servers) setLoading(false);
    }
  };

  useEffect(() => {
    const setValues = (episodeNum: number) => {
      if (!info.episodes || info.episodes.length === 0) return;

      // Ensure episode number is within bounds
      const validEpisodeNum = Math.max(
        1,
        Math.min(episodeNum, info.episodes.length)
      );
      const episode = info.episodes[validEpisodeNum - 1];

      if (episode) {
        setSelectedEpisodeId(episode.id);
        setSelectedEpisodeNumber(episode.number);
        setGroupIndex(Math.floor((episode.number - 1) / groupSize));

        if (episode.id) {
          fetchServers(episode.id);
          setLoading(false);
        }
      }
    };

    if (type === "dub" && info.dub > 0) {
      setSubOrDub(type);
      setValues(info.dub);
    } else if (type === "sub" && info.sub > 0) {
      setSubOrDub(type);
      setValues(info.sub);
    } else {
      const historyType = getHistory();
      setSubOrDub(historyType);
      setValues(1);
    }
  }, [type]);

  // Fixed sub/dub toggle logic
  const handleSubOrDub = (type: string) => {
    if (type !== "sub" && type !== "dub") return;

    setSubOrDub(type);
    setHistory(type);
    setVideoSource(null); // Reset video source when switching type
    setVideoLoading(false);
  };

  const handleVideoLoaded = () => {
    setVideoLoading(false);
  };

  const handleDisplayIframe = () => {
    if (!selectedEpisodeId && info.episodes && info.episodes.length > 0) {
      // If no episode is selected, select the first episode
      handleEpisodeSelect(info.episodes[0]);
    } else if (selectedEpisodeId && !videoSource) {
      // If episode is selected but no video source, fetch it
      console.log(servers);
      fetchVideoSource();
    }
  };

  // Get current servers based on sub/dub selection
  // const currentServers = useMemo(() => {
  //     if (!servers) return null;
  //     return subOrDub === 'sub' ? servers.serversSub : servers.serversDub;
  // }, [servers, subOrDub]);

  // Auto-fetch video source when episode and type are ready
  useEffect(() => {
    if (selectedEpisodeId && subOrDub && !videoSource && !videoLoading) {
      console.log(servers);
      fetchVideoSource();
    }
  }, [selectedEpisodeId, subOrDub]);

  function handleSeeButton(section: string) {
    setSeeMoreOrLess((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  return (
    <div className={styles.watchContainer}>
      {/* Animated Background */}
      <div className={styles.animatedBg}>
        <div className={styles.gridOverlay}></div>
        <div className={styles.floatingParticles}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles[`particle${i % 4}`]}></div>
          ))}
        </div>
      </div>

      {/* Play video container */}
      {!videoSource ? (
        <div className={styles.playVid}>
          {info.image && (
            <div>
              <Image
                src={info.image}
                height={400}
                width={350}
                alt={info.titleMain}
                quality={50}
              />
            </div>
          )}

          <button
            className={styles.playVidBtn}
            onClick={handleDisplayIframe}
            title="Click to play the video"
          >
            <Image src={playBtn} height={200} width={200} alt="play" />
          </button>
        </div>
      ) : (
        <div className={styles.videoSection}>
          <div className={styles.videoFrame}>
            {videoLoading ? (
              <div className={styles.videoLoading}>
                <LoadingText />
                <div className={styles.loadingBars}>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={styles.loadingBar}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <iframe
                src={videoSource}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                className={styles.videoIframe}
                title="Watch now"
                onLoad={handleVideoLoaded}
                onError={() => setVideoLoading(false)}
                allow="encrypted-media; gyroscope; picture-in-picture; fullscreen"
              ></iframe>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingSection}>
          <LoadingComponent />
        </div>
      ) : (
        <div className={styles.contentWrapper}>
          {/* Title Section */}
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>{info.titleMain}</h1>
            <h2 className={styles.japaneseTitle}>{info.titleJapanese}</h2>
            <div className={styles.titleDivider}></div>

            {selectedEpisodeNumber && (
              <div className={styles.episodeIndicator}>
                <span className={styles.episodeLabel}>EPISODE</span>
                <span className={styles.episodeNumber}>
                  {selectedEpisodeNumber}
                </span>
              </div>
            )}
          </div>

          {/* Sub/Dub Toggle */}
          {servers && (
            <div className={styles.typeSelection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.titleGlow}>AUDIO TYPE</span>
              </h3>
              <div className={styles.typeButtons}>
                {servers.serversSub && servers.serversSub.length > 0 && (
                  <button
                    className={`${styles.typeBtn} ${
                      subOrDub === "sub" ? styles.active : ""
                    }`}
                    onClick={() => handleSubOrDub("sub")}
                  >
                    <span>SUB</span>
                    <div className={styles.btnGlow}></div>
                  </button>
                )}
                {servers.serversDub && servers.serversDub.length > 0 && (
                  <button
                    className={`${styles.typeBtn} ${
                      subOrDub === "dub" ? styles.active : ""
                    }`}
                    onClick={() => handleSubOrDub("dub")}
                  >
                    <span>DUB</span>
                    <div className={styles.btnGlow}></div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Episodes Grid */}
          {info.episodes && info.episodes.length > 0 && (
            <div className={styles.episodesSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.titleGlow}>EPISODES</span>
              </h3>

              <div className={styles.episodeControls}>
                <input
                  type="number"
                  placeholder="Go to episode #"
                  min="1"
                  max={info.totalItems}
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value === "0") {
                      setInputValue("");
                      return;
                    }
                    const num = Number(value);
                    if (num >= 1 && num <= info.totalItems) {
                      setInputValue(value);
                    }
                  }}
                  style={{
                    width: "150px",
                    marginRight: "0.5rem",
                    padding: "0.5rem",
                  }}
                />
                <span style={{ whiteSpace: "nowrap" }}>
                  {groupIndex * groupSize + 1} to{" "}
                  {Math.min((groupIndex + 1) * groupSize, info.totalItems)}
                </span>

                {/* Group navigation buttons */}
                <div className={styles.episodeNav}>
                  <button
                    onClick={() => {
                      setGroupIndex(Math.max(0, groupIndex - 1));
                      setInputValue("");
                    }}
                    disabled={groupIndex === 0}
                    className={styles.episodeNavButton}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      setGroupIndex(Math.min(totalGroups - 1, groupIndex + 1));
                      setInputValue("");
                    }}
                    disabled={groupIndex === totalGroups - 1}
                    className={styles.episodeNavButton}
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Episodes */}
              {Number(info.episodes.length) > 5 && (
                <button
                  className="seeSection"
                  onClick={() => handleSeeButton("episodes")}
                >
                  See
                  {seeMoreOrLess["episodes"] ? <p> Less -</p> : <p> More +</p>}
                </button>
              )}
              <div
                className={`${styles.episodesGrid} ${
                  seeMoreOrLess["episodes"] ? "expandHeight" : ""
                }`}
              >
                {groups[groupIndex]?.map((episode: Episode) => (
                  <button
                    key={episode.id}
                    className={`${styles.episodeBtn} ${
                      selectedEpisodeNumber === episode.number
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handleEpisodeSelect(episode)}
                    title={episode.title}
                  >
                    <span className={styles.episodeNum}>{episode.number}</span>
                    <span className={styles.episodeTitle}>{episode.title}</span>

                    {info.sub >= episode.number && (
                      <Image
                        src={subtitle}
                        className={styles.episodeSub}
                        height={20}
                        width={20}
                        alt="sub"
                        title="sub"
                      />
                    )}

                    {info.dub >= episode.number && (
                      <Image
                        src={microphone}
                        className={styles.episodeDub}
                        height={20}
                        width={20}
                        alt="dub"
                        title="dub"
                      />
                    )}

                    <div className={styles.episodeGlow}></div>
                  </button>
                )) || <div>No episodes found in this group</div>}
              </div>
            </div>
          )}

          {/* Meta Information */}
          {info.info ? (
            <div className={styles.metaSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.titleGlow}>META INFORMATION</span>
              </h3>
              <button
                className="seeSection"
                onClick={() => handleSeeButton("meta")}
              >
                See
                {seeMoreOrLess["meta"] ? <p> Less -</p> : <p> More +</p>}
              </button>
              <div
                className={`${styles.metaGrid} ${
                  seeMoreOrLess["meta"] ? "expandHeight" : ""
                }`}
              >
                {info.rate && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>RATING</span>
                    <span className={`${styles.metaValue} ${styles.rating}`}>
                      {info.rate}
                    </span>
                  </div>
                )}
                {info.quality && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>QUALITY</span>
                    <span className={`${styles.metaValue} ${styles.quality}`}>
                      {info.quality}
                    </span>
                  </div>
                )}
                {info.pg && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>PARENTAL GUIDE</span>
                    <span className={`${styles.metaValue} ${styles.pg}`}>
                      {info.pg}
                    </span>
                  </div>
                )}
                {info.info?.status && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>STATUS</span>
                    <span className={`${styles.metaValue} ${styles.status}`}>
                      {info.info.status}
                    </span>
                  </div>
                )}
                {info.info?.aired && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>AIRED</span>
                    <span className={`${styles.metaValue} ${styles.aired}`}>
                      {info.info.aired}
                    </span>
                  </div>
                )}
                {info.info?.duration && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>DURATION</span>
                    <span className={`${styles.metaValue} ${styles.duration}`}>
                      {info.info.duration}
                    </span>
                  </div>
                )}
                {info.info?.synonyms && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>SYNONYMS</span>
                    <span className={`${styles.metaValue} ${styles.studio}`}>
                      {info.info.synonyms}
                    </span>
                  </div>
                )}
                {info.info?.japanese && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>
                      NAME (JAPANESE LANGUAGE)
                    </span>
                    <span className={`${styles.metaValue} ${styles.rating}`}>
                      {info.info.japanese}
                    </span>
                  </div>
                )}
                {info.info?.premiered && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>PREMIERED</span>
                    <span className={`${styles.metaValue} ${styles.pg}`}>
                      {info.info.premiered}
                    </span>
                  </div>
                )}
                {info.info?.malScore && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>MAL SCORE</span>
                    <span className={`${styles.metaValue} ${styles.status}`}>
                      {info.info.malScore}
                    </span>
                  </div>
                )}
                {info.totalItems && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>EPISODES</span>
                    <span
                      className={`${styles.metaValue} ${styles.totalEpisodes}`}
                    >
                      {info.totalItems}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
          {/* Genres */}
          {info.info?.genres && info.info.genres.length > 0 && (
            <div className={styles.genresSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.titleGlow}>GENRES</span>
              </h3>
              <div className={styles.genresGrid}>
                {info.info.genres.map((genre: string, idx: number) => (
                  <span key={idx} className={styles.genreTag}>
                    {genre}
                    <div className={styles.tagGlow}></div>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Synopsis */}
          {info.info?.overview && (
            <div className={styles.synopsisSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.titleGlow}>SYNOPSIS</span>
              </h3>
              {}
              <button
                className="seeSection"
                onClick={() => handleSeeButton("synopsis")}
              >
                See
                {seeMoreOrLess["synopsis"] ? <p> Less -</p> : <p> More +</p>}
              </button>
              <div
                className={`${styles.synopsisContent} ${
                  seeMoreOrLess["synopsis"] ? "expandHeight" : ""
                }`}
              >
                <p>{info.info.overview}</p>
                <div className={styles.synopsisOverlay}></div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {(info.info?.synonyms ||
            info.info?.studios ||
            info.info?.producers) && (
            <div className={styles.additionalInfo}>
              {info.info?.synonyms && (
                <div className={styles.infoItem}>
                  <h4 className={styles.infoLabel}>Alternative Names</h4>
                  <p className={styles.infoValue}>{info.info.synonyms}</p>
                </div>
              )}
              {info.info?.studios && (
                <div className={styles.infoItem}>
                  <h4 className={styles.infoLabel}>Studio Names</h4>
                  <p className={styles.infoValue}>{info.info.studios}</p>
                </div>
              )}
              {info.info?.producers && Array.isArray(info.info.producers) && (
                <div className={styles.infoItem}>
                  <h4 className={styles.infoLabel}>Producers</h4>
                  <p className={styles.infoValue}>
                    {info.info.producers.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {info.recommended && info.recommended.length > 0 && (
        <div className={styles.recommendationsSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.titleGlow}>RECOMMENDED</span>
          </h3>
          <div className={styles.recommendationsGrid}>
            {info.recommended
              .slice(0, 12)
              .map((rec: RecommendedItem, idx: number) => (
                <Link
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}${rec.animeId}`}
                  key={idx}
                  className={styles.recommendationCard}
                  title={rec.title}
                >
                  <div className={styles.recImageContainer}>
                    <Image
                      src={rec.imageUrl}
                      alt={rec.title}
                      className={styles.recImage}
                      width={300}
                      height={350}
                    />
                    <div className={styles.recOverlay}>
                      <span className={styles.recType}>{rec.type}</span>
                      <span className={styles.recDuration}>{rec.duration}</span>
                    </div>
                    <div className={styles.recOverlay2}>
                      <span className={styles.recSub}>
                        <Image src={subtitle} height={15} width={15} alt="" />
                        {rec.sub}
                      </span>
                      <span className={styles.recDub}>
                        <Image src={microphone} height={15} width={15} alt="" />
                        {rec.dub}
                      </span>
                      <span className={styles.recEps}>{rec.eps}</span>
                    </div>
                  </div>
                  <div className={styles.recInfo}>
                    <h4 className={styles.recTitle}>{rec.title}</h4>
                    <p className={styles.recJapanese}>{rec.titleJapanese}</p>
                  </div>
                  <div className={styles.recGlow}></div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchComponent;