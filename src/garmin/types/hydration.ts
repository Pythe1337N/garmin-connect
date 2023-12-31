interface HydrationData {
    userId: number;
    calendarDate: string;
    lastEntryTimestampLocal: string;
    valueInML: number;
    goalInML: number;
    baseGoalInML: number;
    sweatLossInML: number;
    activityIntakeInML: number;
    hydrationMeasurementUnit: string;
    hydrationContainers: HydrationContainer[];
    hydrationAutoGoalEnabled: boolean;
}

interface HydrationContainer {
    name: string | null;
    volume: number;
    unit: string;
}
