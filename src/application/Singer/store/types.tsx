export interface Song {
    name: string
    al: { id: number }
}

export interface Artist {
    name: string
    picUrl: string
}

export interface Singer {
    artist: Artist
    hotSongs: Song[]
}