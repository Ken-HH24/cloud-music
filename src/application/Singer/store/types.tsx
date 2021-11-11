import { Track } from '../../../api/types';

export type Song = Track;

export interface Artist {
    name: string
    picUrl: string
}

export interface Singer {
    artist: Artist
    hotSongs: Song[]
}