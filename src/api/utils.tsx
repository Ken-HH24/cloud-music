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
