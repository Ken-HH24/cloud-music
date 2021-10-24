export interface TrackItem {
    first: string
    second: string
}

export interface RankItem {
    id: number
    name: string
    coverImgUrl: string
    updateFrequency: string
    tracks: TrackItem[]
}