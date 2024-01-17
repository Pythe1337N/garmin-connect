export function toDateString(date: Date) {
    const offset = date.getTimezoneOffset();
    const offsetDate = new Date(date.getTime() - offset * 60 * 1000);
    const [dateString] = offsetDate.toISOString().split('T');
    return dateString;
}

export function calculateTimeDifference(
    sleepStartTimestampGMT: number,
    sleepEndTimestampGMT: number
): { hours: number; minutes: number } {
    // Calculate time difference in seconds
    const timeDifferenceInSeconds =
        (sleepEndTimestampGMT - sleepStartTimestampGMT) / 1000;

    // Convert time difference to hours and minutes
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);

    return {
        hours,
        minutes
    };
}

export function getLocalTimestamp(date: Date, timezone: string) {
    // Get the current local date timestamp in ISO format
    const localTimestampISO = date.toISOString().substring(0, 23);

    // Convert the ISO timestamp to local timezone while maintaining the same format
    const localTimestamp = new Date(localTimestampISO).toLocaleString('en-US', {
        timeZone: timezone,
        hour12: false
    });

    // Format the local timestamp as `YYYY-MM-DDTHH:MM:SS.SSS`
    const formattedLocalTimestamp = new Date(localTimestamp)
        .toISOString()
        .substring(0, 23);
    return formattedLocalTimestamp;
}
