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

export const getAlphaList = (): AlphaItem[] => {
    const wordList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphaList: AlphaItem[] = [];
    for (const alpha of wordList){
        alphaList.push({
            name: alpha,
            key: alpha
        })
    }
    return alphaList;
}

const typeToNumber: { [T: string]: number } = {
    '全部': -1,
    '男歌手': 1,
    '女歌手': 2,
    '乐队': 3
}

const areaToNumber: { [T: string]: number } = {
    '全部': -1,
    '华语': 7,
    '欧美': 96,
    '日本': 8,
    '韩国': 16,
    '其他': 0
}

const tags: SingerTagItem[] = [];
export const getTagList = (): SingerTagItem[] => {
    if (tags.length) {
        return tags;
    } else {
        for (const kType of Object.keys(typeToNumber)) {
            for (const kArea of Object.keys(areaToNumber)) {
                tags.push({
                    name: kType === kArea ? kType : (kArea + kType),
                    area: kArea,
                    type: kType,
                    key: kArea + kType
                })
            }
        }
        return tags;
    }
}


export const getTypeByTag = (tag: SingerTagItem): number => {
    return typeToNumber[tag.type];
}

export const getAreaByTag = (tag: SingerTagItem): number => {
    return areaToNumber[tag.area];
}