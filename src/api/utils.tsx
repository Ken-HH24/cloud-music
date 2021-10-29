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

const typeToString: { [T: string]: string } = {
    '全部': '-1',
    '男歌手': '1',
    '女歌手': '2',
    '乐队': '3'
}

const areaToString: { [T: string]: string } = {
    '全部': '-1',
    '华语': '7',
    '欧美': '96',
    '日本': '8',
    '韩国': '16',
    '其他': '0'
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