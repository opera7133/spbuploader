export interface MapData {
  uid: string;
  createdAt: Date;
  favoritesCount: number;
  map: {
    creator: string;
    desc?: string;
    fileName: string;
    easy: number | string;
    normal: number | string;
    hard: number | string;
  },
  song: {
    composer: string;
    composerUrl?: string;
    fileName: string;
    name: string;
  },
  timeline?: string;
}