export const asyncForEach = async (array: any[], callback: (arrayIndex: any, i: number, array: any[]) => Promise<any>) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};