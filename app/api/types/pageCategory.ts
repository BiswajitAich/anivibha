export type PageCategory =
    "top-airing" |
    "most-popular" |
    "most-favorite" |
    "completed" |
    "recently-updated" |
    "top-upcoming";

export const validPageCategory: PageCategory[] = [
    "top-airing",
    "most-popular",
    "most-favorite",
    "completed",
    "recently-updated",
    "top-upcoming",
];

export type SortCategory =
    "default" |
    "recently_added" |
    "score" |
    "name_az" |
    "released_date" |
    "most_watched" |
    "recently_updated";

export const validSortCategory: SortCategory[] = [
    "default",
    "recently_added",
    "score",
    "name_az",
    "released_date",
    "most_watched",
    "recently_updated",
];

export type LanguageCategory =
    0 |
    1 |
    2 |
    3;
export const validLanguageCategory: LanguageCategory[] = [0, 1, 2, 3];
