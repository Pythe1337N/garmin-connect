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
