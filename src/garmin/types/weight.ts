// weight-service/weight/dayview/2023-12-28

interface DateWeight {
    samplePk: number;
    date: number;
    calendarDate: string;
    weight: number;
    bmi: number | null;
    bodyFat: number | null;
    bodyWater: number | null;
    boneMass: number | null;
    muscleMass: number | null;
    physiqueRating: number | null;
    visceralFat: number | null;
    metabolicAge: number | null;
    sourceType: string;
    timestampGMT: number;
    weightDelta: number;
}

interface TotalAverage {
    from: number;
    until: number;
    weight: number;
    bmi: number | null;
    bodyFat: number | null;
    bodyWater: number | null;
    boneMass: number | null;
    muscleMass: number | null;
    physiqueRating: number | null;
    visceralFat: number | null;
    metabolicAge: number | null;
}

interface WeightData {
    startDate: string;
    endDate: string;
    dateWeightList: DateWeight[];
    totalAverage: TotalAverage;
}

interface UpdateWeight {
    dateTimestamp: string; // Format: "2023-12-31T12:39:00.00"
    gmtTimestamp: string; // Format: "2023-12-31T20:39:00.00"
    unitKey: string; // Example: "lbs"
    value: number; // Example: 202.9
}
