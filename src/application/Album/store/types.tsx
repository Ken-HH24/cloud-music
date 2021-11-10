interface TrackItem {
    id: number
    dt: number
    name: string
    al: { picUrl: string }
    ar: { id: number, name: string }[]
}

export interface PlayListItem {
    id: number
    name: string
    description: string
    coverImgUrl: string
    tracks: TrackItem[]
}