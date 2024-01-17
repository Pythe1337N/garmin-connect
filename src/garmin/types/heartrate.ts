interface HeartRateValueDescriptor {
    key: string;
    index: number;
}

interface HeartRateEntry {
    timestamp: number;
    heartrate: number;
}

interface HeartRate {
    userProfilePK: number;
    calendarDate: string;
    startTimestampGMT: string;
    endTimestampGMT: string;
    startTimestampLocal: string;
    endTimestampLocal: string;
    maxHeartRate: number;
    minHeartRate: number;
    restingHeartRate: number;
    lastSevenDaysAvgRestingHeartRate: number;
    heartRateValueDescriptors: HeartRateValueDescriptor[];
    heartRateValues: HeartRateEntry[][];
}
