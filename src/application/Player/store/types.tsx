export interface Song {
    id: number
    dt: number
    name: string
    al: { picUrl: string }
    ar: { name: string }[]
}