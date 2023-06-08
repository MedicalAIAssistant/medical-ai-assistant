
export const trackTimeWrapper = async (callback: Function, name: string) => {
    const startTime = performance.now();

    const result = await callback();

    const endTime = performance.now();

    const differenceInSec = ((endTime - startTime)/1000).toFixed(3);
    console.log(`${name} takes: ${differenceInSec} sec, it starts at ${startTime} and ends at ${endTime}`)
    return result;
}