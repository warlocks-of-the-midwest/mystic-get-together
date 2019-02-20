function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Attempts some operation up to 5 times, waiting 1 second between attempts.
 * 
 * @param operation The operation to attempt, which should return a Promise.
 * If the Promise resolves, then that value is returned. If it rejects, then
 * the operation is attempted again.
 * @returns The return value of the operation
 */
export const attempt = async function(operation: () => Promise<any>): Promise<any> {
    let attempts: number = 0;
    let error: Error;
    while (attempts < 5) {
        try {
            attempts++;
            return await operation();
        } catch (e) {
            error = e;
        }
        await sleep(1000);
    }
    return Promise.reject(error);
}
