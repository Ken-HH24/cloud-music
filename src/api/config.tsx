import { IconProp } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';

export const baseUrl = 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: baseUrl
})

axiosInstance.interceptors.response.use(
    res => res.data,
    err => {
        console.error('error!!!', err);
    }
);

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

export type playMode = 'random' | 'sequence' | 'loop';
export const modeToIcon: { [key: string]: IconProp } = {
    'sequence': 'sync-alt',
    'random': 'random',
    'loop': 'undo'
}

export {
    axiosInstance,
    typeToString,
    areaToString,
}