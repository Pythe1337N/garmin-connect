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
    // Format the local date as `YYYY-MM-DD`
    const formatted_date = date.toLocaleDateString('sv', {
        timeZone: timezone
    });
    // Format the local time as `HH:MM:SS`
    const formatted_time = date.toLocaleTimeString('sv', {
        timeZone: timezone,
        hour12: false
    });
    // Format millseconds
    const formatted_mill_sec = String(date.getMilliseconds()).padStart(3, '0');

    // Format the local timestamp as `YYYY-MM-DDTHH:MM:SS.SSS`
    return `${formatted_date}T${formatted_time}.${formatted_mill_sec}`;
}
