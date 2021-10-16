export interface RecommendItem {
    picUrl: string;
    playCount: number;
    name: string;
}

export interface BannerItem {
    imageUrl: string;
}

export interface IRecommendState {
    bannerList: BannerItem[];
    recommendList: RecommendItem[];
}