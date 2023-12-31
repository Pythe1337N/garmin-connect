// summary

interface ScorecardSummary {
    id: number;
    customerId: string;
    playerProfileId: number;
    scoreType: string;
    courseName: string;
    startTime: string;
    endTime: string;
    roundInProgress: boolean;
    strokes: number;
    handicappedStrokes: number;
    scoreWithHandicap: number;
    scoreWithoutHandicap: number;
    holesCompleted: number;
    roundType: string;
}

interface GolfSummary {
    pageNumber: number;
    rowsPerPage: number;
    totalRows: number;
    scorecardSummaries: ScorecardSummary[];
}

// detail

interface Hole {
    number: number;
    strokes: number;
    penalties: number;
    handicapScore: number;
    putts: number;
    fairwayShotOutcome: string;
    pinPositionLat: number;
    pinPositionLon: number;
}

interface GolfScorecard {
    id: number;
    customerId: string;
    playerProfileId: number;
    roundPlayerName: string;
    connectDisplayName: string;
    courseGlobalId: number;
    courseSnapshotId: number;
    frontNineGlobalCourseId: number;
    scoreType: string;
    useHandicapScoring: boolean;
    useStrokeCounting: boolean;
    distanceWalked: number;
    stepsTaken: number;
    startTime: string;
    formattedStartTime: string;
    endTime: string;
    formattedEndTime: string;
    unitId: string;
    roundType: string;
    inProgress: boolean;
    excludeFromStats: boolean;
    holesCompleted: number;
    publicRound: boolean;
    score: number;
    playerHandicap: number;
    courseHandicapStr: string;
    teeBox: string;
    handicapType: string;
    teeBoxRating: number;
    teeBoxSlope: number;
    lastModifiedDt: string;
    sensorOnPutter: boolean;
    handicappedStrokes: number;
}
