import { axiosInstance } from './config';
import { BannerItem, RecommendItem } from '../application/Recommend/store/types';

interface IBannerResponse {
    banners: BannerItem[];
}

interface IRecommendResponse {
    result: RecommendItem[];
}

export const getBannerRequest = () => {
    return axiosInstance.get<any, IBannerResponse>('/banner');
}

export const getRecommendListRequest = () => {
    return axiosInstance.get<any, IRecommendResponse>('/personalized');
}