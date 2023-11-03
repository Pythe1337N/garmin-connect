export function toDateString(date: Date) {
    const offset = date.getTimezoneOffset();
    const offsetDate = new Date(date.getTime() - offset * 60 * 1000);
    const [dateString] = offsetDate.toISOString().split('T');
    return dateString;
}
