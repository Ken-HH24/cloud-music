import { axiosInstance } from './config';
import { RecommendTypes } from '../application/Recommend/store';
import { SingersTypes } from '../application/Singers/store';
import { RankTypes } from '../application/Rank/store';

interface IBannerResponse {
    banners: RecommendTypes.BannerItem[];
}

interface IRecommendResponse {
    result: RecommendTypes.RecommendItem[];
}

interface ISingerList {
    artists: SingersTypes.ArtistItem[];
}

interface IRankList {
    list: RankTypes.RankItem[];
}

export const getBannerRequest = () => {
    return axiosInstance.get<any, IBannerResponse>('/banner');
}

export const getRecommendListRequest = () => {
    return axiosInstance.get<any, IRecommendResponse>('/personalized');
}

export const getSingerListRequest = (type: string = '-1', area: string = '-1', initial: string = '-1', offset: number = 0) => {
    return axiosInstance.get<any, ISingerList>(`/artist/list?type=${type}&area=${area}&initial=${initial}&offset=${offset}`);
}

export const getRankListRequest = () => {
    return axiosInstance.get<any, IRankList>('/toplist/detail');
}