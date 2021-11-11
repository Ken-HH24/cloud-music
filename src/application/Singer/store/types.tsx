export interface Song {
    id: number
    dt: number
    name: string
    al: { picUrl: string }
    ar: { name: string }[]
}

export interface Artist {
    name: string
    picUrl: string
}

export interface Singer {
    artist: Artist
    hotSongs: Song[]
}