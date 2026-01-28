/**
 * Returns the current time in milliseconds.
 * If TEST_MODE is enabled and x-test-now-ms header is present, returns that value.
 * Otherwise returns the system's current time.
 */
export function getCurrentTime(req?: Request | null): number {
    if (process.env.TEST_MODE === '1' && req) {
        const testTime = req.headers.get('x-test-now-ms');
        if (testTime) {
            const parsed = parseInt(testTime, 10);
            if (!isNaN(parsed)) {
                return parsed;
            }
        }
    }
    return Date.now();
}
