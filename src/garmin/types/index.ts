export type GCUserProfileId = number;
export type GCUserHash = string;
export type GCWorkoutId = string;
export type GCBadgeId = number;
export type GCGearId = number;
export type GCGearUuid = string;
export type GarminDomain = 'garmin.com' | 'garmin.cn';

export enum ExportFileType {
    tcx = 'tcx',
    gpx = 'gpx',
    kml = 'kml',
    zip = 'zip'
}

export enum UploadFileType {
    tcx = 'tcx',
    gpx = 'gpx',
    fit = 'fit'
}
export type ExportFileTypeValue = keyof typeof ExportFileType;
export type UploadFileTypeTypeValue = keyof typeof UploadFileType;

export interface IUserInfo {
    userProfileId: GCUserProfileId;
    username: string;
    emailAddress: string;
    locale: string;
    measurementSystemKey: string;
    timeFormatKey: string;
    dateFormatKey: string;
    numberFormatKey: string;
    heartRateDisplayFormatKey: string;
    powerDisplayFormatKey: string;
    timeZoneGroupKey: string;
    dayKey: unknown;
    isPublicByDefault: boolean;
    roles: string[];
    displayName: GCUserHash;
    tocAcceptedDate: string;
    defaultActivityPrivacy: unknown;
    customerId: string;
    birthdate: unknown;
    socialNetwork: string;
    socialIcon: string;
    systemUser: boolean;
    systemMetricUser: boolean;
    underAge: boolean;
}

export interface ISocialProfile {
    id: number;
    profileId: GCUserProfileId;
    garminGUID: string;
    displayName: GCUserHash;
    fullName: string;
    userName: string;
    profileImageUuid: unknown;
    profileImageUrlLarge: string;
    profileImageUrlMedium: string;
    profileImageUrlSmall: string;
    location: string;
    facebookUrl: unknown;
    twitterUrl: unknown;
    personalWebsite: unknown;
    motivation: unknown;
    bio: unknown;
    primaryActivity: unknown;
    favoriteActivityTypes: unknown[];
    runningTrainingSpeed: number;
    cyclingTrainingSpeed: number;
    favoriteCyclingActivityTypes: unknown[];
    cyclingClassification: unknown;
    cyclingMaxAvgPower: number;
    swimmingTrainingSpeed: number;
    profileVisibility: string;
    activityStartVisibility: string;
    activityMapVisibility: string;
    courseVisibility: string;
    activityHeartRateVisibility: string;
    activityPowerVisibility: string;
    badgeVisibility: string;
    showAge: boolean;
    showWeight: boolean;
    showHeight: boolean;
    showWeightClass: boolean;
    showAgeRange: boolean;
    showGender: boolean;
    showActivityClass: boolean;
    showVO2Max: boolean;
    showPersonalRecords: boolean;
    showLast12Months: boolean;
    showLifetimeTotals: boolean;
    showUpcomingEvents: boolean;
    showRecentFavorites: boolean;
    showRecentDevice: boolean;
    showRecentGear: boolean;
    showBadges: boolean;
    otherActivity: null;
    otherPrimaryActivity: null;
    otherMotivation: null;
    userRoles: string[];
    nameApproved: boolean;
    userProfileFullName: string;
    makeGolfScorecardsPrivate: boolean;
    allowGolfLiveScoring: boolean;
    allowGolfScoringByConnections: boolean;
    userLevel: number;
    userPoint: number;
    levelUpdateDate: string;
    levelIsViewed: boolean;
    levelPointThreshold: number;
    userPointOffset: number;
    userPro: boolean;
}

export interface ISocialConnection {
    userId: number;
    displayName: GCUserHash;
    fullName: string;
    location: string;
    profileImageUrlMedium: string;
    profileImageUrlSmall: string;
    userLevel: number;
    connectionRequestId: number;
    connectionRequestorId: number;
    userConnectionStatus: number;
    userRoles: string[];
    profileVisibility: number;
    deviceInvitations: unknown[];
    nameApproved: boolean;
    badgeVisibility: number;
    userPro: boolean;
}

export interface ISocialConnections {
    fullName: string;
    userConnections: ISocialConnection[];
    pagination: unknown;
}

export interface IBadgeSocialConnection {
    userProfileId: GCUserProfileId;
    fullName: string;
    displayName: GCUserHash;
    profileImageUrlMedium: string;
    profileImageUrlSmall: string;
    userLevel: number;
    badgeEarnedDate: string;
}

export interface IBadgeRelated {
    badgeId: GCBadgeId;
    badgeKey: string;
    badgeName: string;
    badgeUuid: unknown;
    badgeCategoryId: number;
    badgeDifficultyId: number;
    badgePoints: number;
    badgeTypeIds: number[];
    earnedByMe: boolean;
}

export interface IBadge {
    badgeId: GCBadgeId;
    badgeKey: string;
    badgeName: string;
    badgeUuid: unknown;
    badgeCategoryId: number;
    badgeDifficultyId: number;
    badgePoints: number;
    badgeTypeIds: number[];
    badgeSeriesId: unknown;
    badgeStartDate: string;
    badgeEndDate: unknown;
    userProfileId: number;
    fullName: string;
    displayName: string;
    badgeEarnedDate: string;
    badgeEarnedNumber: number;
    badgeLimitCount: unknown;
    badgeIsViewed: boolean;
    badgeProgressValue: number;
    badgeTargetValue: unknown;
    badgeUnitId: unknown;
    badgeAssocTypeId: number;
    badgeAssocDataId: unknown;
    badgeAssocDataName: unknown;
    earnedByMe: boolean;
    currentPlayerType: unknown;
    userJoined: unknown;
    badgeChallengeStatusId: unknown;
    badgePromotionCodeType: unknown;
    promotionCodeStatus: unknown;
    createDate: string;
    relatedBadges: IBadgeRelated[] | null;
    connectionNumber: number;
    connections: IBadgeSocialConnection[] | null;
}

export interface Gear {
    gearPk: number;
    uuid: string;
    userProfilePk: number;
    gearMakeName: string;
    gearModelName: string;
    gearTypeName: string;
    gearStatusName: string;
    displayName: string;
    customMakeModel: string;
    imageNameLarge: any;
    imageNameMedium: any;
    imageNameSmall: any;
    dateBegin: string;
    dateEnd: any;
    maximumMeters: number;
    notified: boolean;
    createDate: string;
    updateDate: string;
}

export interface IOauth1Consumer {
    key: string;
    secret: string;
}
export interface IOauth1 {
    token: IOauth1Token;
    oauth: OAuth;
}

export interface IGarminTokens {
    oauth1: IOauth1Token;
    oauth2: IOauth2Token;
}
export interface IOauth1Token {
    oauth_token: string;
    oauth_token_secret: string;
}

export interface IOauth2Token {
    // from Garmin API
    scope: string;
    jti: string;
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: number;

    // added
    expires_at: number;
    refresh_token_expires_at: number;
    last_update_date: string;
    expires_date: string;
}

export interface IUserSettings {
    id: number;
    userData: IUserData;
    userSleep: {
        sleepTime: number;
        defaultSleepTime: boolean;
        wakeTime: number;
        defaultWakeTime: boolean;
    };
    connectDate: unknown;
    sourceType: unknown;
    userSleepWindows: IUserSleepWindows[];
}
export interface IUserData {
    gender: unknown;
    weight: unknown;
    height: unknown;
    timeFormat: string;
    birthDate: unknown;
    measurementSystem: string;
    activityLevel: unknown;
    handedness: string;
    powerFormat: {
        formatId: number;
        formatKey: string;
        minFraction: number;
        maxFraction: number;
        groupingUsed: boolean;
        displayFormat: unknown;
    };
    heartRateFormat: {
        formatId: number;
        formatKey: string;
        minFraction: number;
        maxFraction: number;
        groupingUsed: boolean;
        displayFormat: unknown;
    };
    firstDayOfWeek: {
        dayId: number;
        dayName: string;
        sortOrder: number;
        isPossibleFirstDay: boolean;
    };
    vo2MaxRunning: unknown;
    vo2MaxCycling: unknown;
    lactateThresholdSpeed: unknown;
    lactateThresholdHeartRate: unknown;
    diveNumber: unknown;
    intensityMinutesCalcMethod: string;
    moderateIntensityMinutesHrZone: number;
    vigorousIntensityMinutesHrZone: number;
    hydrationMeasurementUnit: string;
    hydrationContainers: unknown[];
    hydrationAutoGoalEnabled: boolean;
    firstbeatMaxStressScore: unknown;
    firstbeatCyclingLtTimestamp: unknown;
    firstbeatRunningLtTimestamp: unknown;
    thresholdHeartRateAutoDetected: unknown;
    ftpAutoDetected: unknown;
    trainingStatusPausedDate: unknown;
    weatherLocation: {
        useFixedLocation: unknown;
        latitude: unknown;
        longitude: unknown;
        locationName: unknown;
        isoCountryCode: unknown;
        postalCode: unknown;
    };
    golfDistanceUnit: string;
    golfElevationUnit: unknown;
    golfSpeedUnit: unknown;
    externalBottomTime: unknown;
}
export interface IUserSleepWindows {
    sleepWindowFrequency: string;
    startSleepTimeSecondsFromMidnight: number;
    endSleepTimeSecondsFromMidnight: number;
}

export interface ICountActivities {
    countOfActivities: number;
    date: string;
    stats: {
        all: Record<string, any>;
    };
}

export interface IActivityGear {
    gearPk: GCGearId;
    uuid: GCGearUuid;
    userProfilePk: GCUserProfileId;
    gearMakeName: string;
    gearModelName: string;
    gearTypeName: string;
    gearStatusName: string;
    displayName: string | null;
    customMakeModel: string;
    imageNameLarge: string | null;
    imageNameMedium: string | null;
    imageNameSmall: string | null;
    dateBegin: string;
    dateEnd: string | null;
    maximumMeters: number;
    notified: boolean;
    createDate: string;
    updateDate: string;
}

// Workouts

export interface IWorkout {
    workoutId?: number;
    ownerId?: number;
    workoutName: string;
    description?: string;
    updateDate: Date;
    createdDate: Date;
    sportType: ISportType;
    trainingPlanId: null;
    author: IAuthor;
    estimatedDurationInSecs: number;
    estimatedDistanceInMeters: null;
    estimateType: null;
    estimatedDistanceUnit: IUnit;
    poolLength: number;
    poolLengthUnit: IUnit;
    workoutProvider: string;
    workoutSourceId: string;
    consumer: null;
    atpPlanId: null;
    workoutNameI18nKey: null;
    descriptionI18nKey: null;
    shared: boolean;
    estimated: boolean;
}

export interface IWorkoutDetail extends IWorkout {
    workoutSegments: IWorkoutSegment[];
}
export interface IAuthor {
    userProfilePk: null;
    displayName: null;
    fullName: null;
    profileImgNameLarge: null;
    profileImgNameMedium: null;
    profileImgNameSmall: null;
    userPro: boolean;
    vivokidUser: boolean;
}

export interface IUnit {
    unitId: null;
    unitKey: null;
    factor: null;
}

export interface ISportType {
    sportTypeId: number;
    sportTypeKey: string;
    displayOrder?: number;
}

export interface IWorkoutSegment {
    segmentOrder: number;
    sportType: ISportType;
    workoutSteps: IWorkoutStep[];
}

export interface IWorkoutStep {
    type: string;
    stepId: number;
    stepOrder: number;
    stepType: IStepType;
    childStepId: null;
    description: null;
    endCondition: IEndCondition;
    endConditionValue: number | null;
    preferredEndConditionUnit: IUnit | null;
    endConditionCompare: null;
    targetType: ITargetType;
    targetValueOne: null;
    targetValueTwo: null;
    targetValueUnit: null;
    zoneNumber: null;
    secondaryTargetType: null;
    secondaryTargetValueOne: null;
    secondaryTargetValueTwo: null;
    secondaryTargetValueUnit: null;
    secondaryZoneNumber: null;
    endConditionZone: null;
    strokeType: IStrokeType;
    equipmentType: IEquipmentType;
    category: null;
    exerciseName: null;
    workoutProvider: null;
    providerExerciseSourceId: null;
    weightValue: null;
    weightUnit: null;
}

export interface IEndCondition {
    conditionTypeId: number;
    conditionTypeKey: string;
    displayOrder: number;
    displayable: boolean;
}

export interface IEquipmentType {
    equipmentTypeId: number;
    equipmentTypeKey: null;
    displayOrder: number;
}

export interface IStepType {
    stepTypeId: number;
    stepTypeKey: string;
    displayOrder: number;
}

export interface IStrokeType {
    strokeTypeId: number;
    strokeTypeKey: null;
    displayOrder: number;
}

export interface ITargetType {
    workoutTargetTypeId: number;
    workoutTargetTypeKey: string;
    displayOrder: number;
}

// IDailySummary

export interface IDailyStepsType {
    calendarDate: string;
    stepGoal: number;
    totalDistance: number;
    totalSteps: number;
}
