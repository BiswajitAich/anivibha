"use client"
import styles from '@/app/(components)/search/styles/searchEpisodes.module.css';
import searchIcon from '@/public/icons/icons-search.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { searchAction } from './searchAction';
import { SearchResults } from '@/app/utils/parsers/searchParser';
import Link from 'next/link';
const fetchSearchResults = async (keywords: string, page: number = 1): Promise<SearchResults[]> => {
    try {
        const data = await searchAction(keywords, page);
        console.log(`Searching for: ${keywords} on page ${page}, data:`, data);

        return data;
    } catch (err) {
        console.error('Error in fetchSearchResults:', err);
        return [];
    }
}

const SearchEpisodes = () => {
    const [displayInput, setDisplayInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResults[] | []>([]);
    const [isResultsSearched, setIsResultsSearched] = useState<boolean>(false);

    useEffect(() => {
        setDisplayInput(window.innerWidth > 768);
    }, []);

    const handleSearchButtinClick = async () => {

        if (window.innerWidth <= 768 && !displayInput) {
            setDisplayInput(!displayInput);
            return;
        }
        if (!inputValue.trim() && window.innerWidth <= 768) {
            setDisplayInput(false);
            setInputValue('');
            return;
        }
        setTimeout(() => {
            setDisabled(false);
        }, 1000 * 5);
        setDisabled(true);

        if (!inputValue.trim()) {
            setInputValue('');
            setSearchResults([]);
            if (window.innerWidth <= 768) {
                setDisplayInput(false);
            }
            return;
        }
        try {
            setInputValue('');
            setSearchResults(await fetchSearchResults(inputValue, 1));
            setIsResultsSearched(true);
        } catch (error) {
            console.error('Error during search:', error);
            setIsResultsSearched(false);
        }
        // setInputValue('');
        // setDisplayInput(false);
    }
    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchResultContainer}
                style={{ display: displayInput ? 'block' : 'none' }}
            >
                <input
                    type="text"
                    placeholder="Search Episodes"
                    className={styles.searchInput}
                    autoComplete="off"
                    spellCheck="false"
                    aria-label="Search Episodes"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <ul className={styles.searchResult}>
                    {searchResults.length > 0 ? (
                        searchResults.map((item: SearchResults, idx: number) => (
                            <li key={idx} className={styles.item} title={item.name}>
                                <Link href={`/watch/${item.id}`} className={styles.itemClass} >
                                    <div className={styles.rank}>{idx + 1}</div>
                                    <div className={styles.thumbnailWrapper}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            className={styles.thumbnail}
                                            height={100}
                                            width={80}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.itemTitle} title={item.name}>
                                            {item.name}
                                        </div>
                                        {item.japaneseName && <p className={styles.infoJpName}>{item.japaneseName}</p>}
                                        {(item.releaseDate || item.type || item.duration) && (
                                            <div className={styles.extraInfo}>
                                                {item.releaseDate && <span className={styles.itemReleaseDate}>{item.releaseDate}</span>}
                                                {item.releaseDate && <span className={styles.dot}>|</span>}

                                                {item.type && <span className={styles.itemType}>{item.type}</span>}
                                                {(item.type && item.duration) && <span className={styles.dot}>|</span>}

                                                {item.duration && <span className={styles.duration}>{item.duration}</span>}
                                            </div>
                                        )}

                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <div className={styles.noResults} style={{ display: isResultsSearched ? 'block' : 'none' }}>No results found</div>
                    )}
                </ul>
            </div>
            <button className={styles.searchButton} onClick={handleSearchButtinClick} disabled={disabled}>
                <Image src={searchIcon} alt="Search Icon" width={32} height={32} className={styles.searchIcon} />
            </button>
        </div >
    );
}

export default SearchEpisodes;