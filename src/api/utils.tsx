import { typeToString, areaToString } from './config';
import { RankItem } from '../application/Rank/store/types';
import { SingerTagItem, AlphaItem } from '../application/Singers/store/types';

export const getCount = (count: number): string => {
    if (count < 0)
        return '';
    else if (count < 10000)
        return count.toString();
    else if (count / 10000 < 10000)
        return (Math.floor(count / 1000) / 10).toString() + '万';
    else
        return (Math.floor(count / 10000000) / 10).toString() + '亿';
}

export const debounce = (func: Function | undefined, delay: number) => {
    if (!func) {
        return () => { };
    }
    let timer: NodeJS.Timeout;
    return function (...args: any[]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this as any, args);
            clearTimeout(timer);
        }, delay);
    }
}

export const throttle = (func: Function | undefined, delay: number) => {
    if (!func) {
        return () => { };
    }
    let timer: NodeJS.Timeout | null;
    return function (...args: any[]) {
        if (timer) {
            return null;
        } else {
            timer = setTimeout(() => {
                timer = null;
                func.apply(this as any, args);
            }, delay);
        }
    }
}

export const getAlphaList = (): AlphaItem[] => {
    const wordList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphaList: AlphaItem[] = [];
    for (const alpha of wordList) {
        alphaList.push({
            name: alpha,
            key: alpha
        })
    }
    return alphaList;
}

const tags: SingerTagItem[] = [];
const keyToType: { [T: string]: string } = {};
const keyToArea: { [T: string]: string } = {};
export const getTagList = (): SingerTagItem[] => {
    if (tags.length) {
        return tags;
    } else {
        for (const kType of Object.keys(typeToString)) {
            for (const kArea of Object.keys(areaToString)) {
                tags.push({
                    name: kType === kArea ? kType : (kArea + kType),
                    area: kArea,
                    type: kType,
                    key: typeToString[kType] + areaToString[kArea]
                });
                keyToType[`${typeToString[kType] + areaToString[kArea]}`] = typeToString[kType];
                keyToArea[`${typeToString[kType] + areaToString[kArea]}`] = areaToString[kArea];
            }
        }
        return tags;
    }
}

export const getTypeByKey = (key: string): string => {
    return keyToType[key];
}

export const getAreaByKey = (key: string): string => {
    return keyToArea[key];
}

export const splitRankListIndex = (rankList: RankItem[]): number => {
    let index = rankList.length;
    for (let i = 0; i < rankList.length; i++) {
        if (rankList[i].tracks.length === 0) {
            index = i;
            break;
        }
    }
    return index;
}

export const getSongUrl = (id: number): string => {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

export const formatSongTime = (time: number): string => {
    const interval = time | 0;
    const minute = Math.floor(interval / 60);
    const seconde = interval - minute * 60;
    return `${minute < 10 ? ('0' + minute) : minute}:${seconde < 10 ? ('0' + seconde) : seconde}`;
}

export function shuffleList<T>(list: T[]): T[] {
    const len = list.length;
    const resList = list.slice();
    for (let i = 0; i < len; i++) {
        const x = (Math.random() * len) | 0;
        const y = (Math.random() * len) | 0;
        const temp = resList[x];
        resList[x] = resList[y];
        resList[y] = temp;
    }
    return resList;
}