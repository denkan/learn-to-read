import { WordSet } from '../core/store.service';

export interface Game {
  wordsetId: string;
  subGames: SubGame[];
}

export interface GameInfo extends Game {
  wordset: WordSet;
  subGames: SubGameInfo[];
  subGame: {
    curr: SubGameInfo;
    prev?: SubGameInfo;
    next?: SubGameInfo;
  };
}

export enum SubGameType {
  MapLowerToUpper,
  MapUpperToLower,
}
export interface SubGame<T = unknown> {
  type: SubGameType;
  startedAt?: number; // epoch
  endedAt?: number; // epoch
  scoreRatio?: number; // 0-1
  data?: T;
}

export interface SubGameInfo extends SubGame {
  index: number;
}
