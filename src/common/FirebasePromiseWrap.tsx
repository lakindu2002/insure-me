export const wrapFirebasePromise = (promise: Promise<any>, isConnected: boolean | null) => {
    if (isConnected && isConnected !== null) {
        // if connected to internet, return the promise
        return promise;
    }
    // if not connected to internet, return a resolved promise to let firebase add to queue.
    return Promise.resolve();
}