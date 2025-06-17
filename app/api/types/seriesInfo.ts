export interface Episode {
  number: number;
  id: string;
  title: string;
  japaneseTitle: string;
}

export interface RecommendedItem {
  id: string;
  title: string;
  titleJapanese: string;
  link: string;
  animeId: string;
  imageUrl: string;
  type?: string;
  duration?: string;
  sub?: number;
  dub?: number;
  eps?: number;
  rate?: string;
}

export interface SeriesInfo {
  id: string;
  image: string;
  totalItems: number;
  episodes: Episode[];
  titleMain: string;
  titleJapanese: string;
  rate: string;
  quality: string;
  pg: string;
  sub: number;
  dub: number;
  eps: number;
  recommended: RecommendedItem[];
  info: Record<string, any>;
}
