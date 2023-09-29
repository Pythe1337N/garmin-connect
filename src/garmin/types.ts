export type GCUserProfileId = number;
export type GCUserHash = string;
export type GCActivityId = number;
export type GCWorkoutId = string;
export type GCBadgeId = number;
export type GarminDomain = 'garmin.com' | 'garmin.cn';

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

export interface IActivity {
    activityId: GCActivityId;
    activityName: string;
    description: unknown;
    startTimeLocal: string;
    startTimeGMT: string;
    activityType: {
        typeId: number;
        typeKey: string;
        parentTypeId: number;
        isHidden: boolean;
        sortOrder: unknown;
        trimmable: boolean;
        restricted: boolean;
    };
    eventType: { typeId: number; typeKey: string; sortOrder: number };
    comments: unknown;
    parentId: unknown;
    distance: number;
    duration: number;
    elapsedDuration: number;
    movingDuration: number;
    elevationGain: number;
    elevationLoss: number;
    averageSpeed: number;
    maxSpeed: number;
    startLatitude: number;
    startLongitude: number;
    hasPolyline: boolean;
    ownerId: number;
    ownerDisplayName: string;
    ownerFullName: string;
    ownerProfileImageUrlSmall: string;
    ownerProfileImageUrlMedium: string;
    ownerProfileImageUrlLarge: string;
    calories: number;
    averageHR: number;
    maxHR: number;
    averageRunningCadenceInStepsPerMinute: number;
    maxRunningCadenceInStepsPerMinute: number;
    averageBikingCadenceInRevPerMinute: unknown;
    maxBikingCadenceInRevPerMinute: unknown;
    averageSwimCadenceInStrokesPerMinute: unknown;
    maxSwimCadenceInStrokesPerMinute: unknown;
    averageSwolf: unknown;
    activeLengths: unknown;
    steps: number;
    conversationUuid: unknown;
    conversationPk: unknown;
    numberOfActivityLikes: unknown;
    numberOfActivityComments: unknown;
    likedByUser: unknown;
    commentedByUser: unknown;
    activityLikeDisplayNames: unknown;
    activityLikeFullNames: unknown;
    activityLikeProfileImageUrls: unknown;
    requestorRelationship: unknown;
    userRoles: string[];
    privacy: { typeId: number; typeKey: string };
    userPro: boolean;
    courseId: unknown;
    poolLength: unknown;
    unitOfPoolLength: unknown;
    hasVideo: boolean;
    videoUrl: unknown;
    timeZoneId: number;
    beginTimestamp: number;
    sportTypeId: number;
    avgPower: unknown;
    maxPower: unknown;
    aerobicTrainingEffect: unknown;
    anaerobicTrainingEffect: unknown;
    strokes: unknown;
    normPower: unknown;
    leftBalance: unknown;
    rightBalance: unknown;
    avgLeftBalance: unknown;
    max20MinPower: unknown;
    avgVerticalOscillation: unknown;
    avgGroundContactTime: unknown;
    avgStrideLength: number;
    avgFractionalCadence: unknown;
    maxFractionalCadence: unknown;
    trainingStressScore: unknown;
    intensityFactor: unknown;
    vO2MaxValue: number;
    avgVerticalRatio: unknown;
    avgGroundContactBalance: unknown;
    lactateThresholdBpm: unknown;
    lactateThresholdSpeed: unknown;
    maxFtp: unknown;
    avgStrokeDistance: unknown;
    avgStrokeCadence: unknown;
    maxStrokeCadence: unknown;
    workoutId: unknown;
    avgStrokes: unknown;
    minStrokes: unknown;
    deviceId: number;
    minTemperature: unknown;
    maxTemperature: unknown;
    minElevation: number;
    maxElevation: number;
    avgDoubleCadence: unknown;
    maxDoubleCadence: number;
    summarizedExerciseSets: unknown;
    maxDepth: unknown;
    avgDepth: unknown;
    surfaceInterval: unknown;
    startN2: unknown;
    endN2: unknown;
    startCns: unknown;
    endCns: unknown;
    summarizedDiveInfo: {
        weight: unknown;
        weightUnit: unknown;
        visibility: unknown;
        visibilityUnit: unknown;
        surfaceCondition: unknown;
        current: unknown;
        waterType: unknown;
        waterDensity: unknown;
        summarizedDiveGases: [];
        totalSurfaceTime: unknown;
    };
    activityLikeAuthors: unknown;
    avgVerticalSpeed: unknown;
    maxVerticalSpeed: number;
    floorsClimbed: unknown;
    floorsDescended: unknown;
    manufacturer: string;
    diveNumber: unknown;
    locationName: string;
    bottomTime: unknown;
    lapCount: number;
    endLatitude: number;
    endLongitude: number;
    minAirSpeed: unknown;
    maxAirSpeed: unknown;
    avgAirSpeed: unknown;
    avgWindYawAngle: unknown;
    minCda: unknown;
    maxCda: unknown;
    avgCda: unknown;
    avgWattsPerCda: unknown;
    flow: unknown;
    grit: unknown;
    jumpCount: unknown;
    caloriesEstimated: unknown;
    caloriesConsumed: unknown;
    waterEstimated: unknown;
    waterConsumed: unknown;
    maxAvgPower_1: unknown;
    maxAvgPower_2: unknown;
    maxAvgPower_5: unknown;
    maxAvgPower_10: unknown;
    maxAvgPower_20: unknown;
    maxAvgPower_30: unknown;
    maxAvgPower_60: unknown;
    maxAvgPower_120: unknown;
    maxAvgPower_300: unknown;
    maxAvgPower_600: unknown;
    maxAvgPower_1200: unknown;
    maxAvgPower_1800: unknown;
    maxAvgPower_3600: unknown;
    maxAvgPower_7200: unknown;
    maxAvgPower_18000: unknown;
    excludeFromPowerCurveReports: unknown;
    totalSets: unknown;
    activeSets: unknown;
    totalReps: unknown;
    minRespirationRate: unknown;
    maxRespirationRate: unknown;
    avgRespirationRate: unknown;
    trainingEffectLabel: unknown;
    activityTrainingLoad: unknown;
    avgFlow: unknown;
    avgGrit: unknown;
    minActivityLapDuration: number;
    avgStress: unknown;
    startStress: unknown;
    endStress: unknown;
    differenceStress: unknown;
    maxStress: unknown;
    aerobicTrainingEffectMessage: unknown;
    anaerobicTrainingEffectMessage: unknown;
    splitSummaries: [];
    hasSplits: boolean;
    maxBottomTime: unknown;
    hasSeedFirstbeatProfile: unknown;
    calendarEventId: unknown;
    calendarEventUuid: unknown;
    avgGradeAdjustedSpeed: unknown;
    avgWheelchairCadence: unknown;
    maxWheelchairCadence: unknown;
    purposeful: boolean;
    manualActivity: boolean;
    autoCalcCalories: boolean;
    elevationCorrected: boolean;
    atpActivity: boolean;
    favorite: boolean;
    decoDive: unknown;
    pr: boolean;
    parent: boolean;
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

export interface IActivityDetails {
    activityId: number;
    activityUUID: {
        uuid: string;
    };
    activityName: string;
    userProfileId: number;
    isMultiSportParent: boolean;
    activityTypeDTO: {
        typeId: number;
        typeKey: string;
        parentTypeId: number;
        isHidden: boolean;
        restricted: boolean;
        trimmable: boolean;
    };
    eventTypeDTO: {
        typeId: number;
        typeKey: string;
        sortOrder: number;
    };
    accessControlRuleDTO: {
        typeId: number;
        typeKey: string;
    };
    timeZoneUnitDTO: {
        unitId: number;
        unitKey: string;
        factor: number;
        timeZone: string;
    };
    metadataDTO: {
        isOriginal: boolean;
        deviceApplicationInstallationId: number;
        agentApplicationInstallationId?: null;
        agentString?: null;
        fileFormat: {
            formatId: number;
            formatKey: string;
        };
        associatedCourseId?: null;
        lastUpdateDate: string;
        uploadedDate: string;
        videoUrl?: null;
        hasPolyline: boolean;
        hasChartData: boolean;
        hasHrTimeInZones: boolean;
        hasPowerTimeInZones: boolean;
        userInfoDto: {
            userProfilePk: number;
            displayname: string;
            fullname: string;
            profileImageUrlLarge?: null;
            profileImageUrlMedium: string;
            profileImageUrlSmall: string;
            userPro: boolean;
        };
        childIds?: null[] | null;
        childActivityTypes?: null[] | null;
        sensors?:
            | {
                  manufacturer: string;
                  serialNumber: number;
                  sku: string;
                  fitProductNumber: number;
                  sourceType: string;
                  antplusDeviceType: string;
                  softwareVersion: number;
                  batteryStatus: string;
              }[]
            | null;
        activityImages?:
            | {
                  imageId: string;
                  url: string;
                  smallUrl: string;
                  mediumUrl: string;
                  expirationTimestamp?: null;
                  latitude?: null;
                  longitude?: null;
                  photoDate?: null;
              }[]
            | null;
        manufacturer: string;
        diveNumber?: null;
        lapCount: number;
        associatedWorkoutId: number;
        isAtpActivity?: null;
        deviceMetaDataDTO: {
            deviceId: string;
            deviceTypePk: number;
            deviceVersionPk: number;
        };
        hasIntensityIntervals: boolean;
        hasSplits: boolean;
        eBikeMaxAssistModes?: null;
        eBikeBatteryUsage?: null;
        eBikeBatteryRemaining?: null;
        eBikeAssistModeInfoDTOList?: null;
        calendarEventInfo?: null;
        personalRecord: boolean;
        gcj02: boolean;
        runPowerWindDataEnabled?: null;
        autoCalcCalories: boolean;
        favorite: boolean;
        manualActivity: boolean;
        trimmed: boolean;
        elevationCorrected: boolean;
    };
    summaryDTO: {
        startTimeLocal: string;
        startTimeGMT: string;
        startLatitude: number;
        startLongitude: number;
        distance: number;
        duration: number;
        movingDuration: number;
        elapsedDuration: number;
        elevationGain: number;
        elevationLoss: number;
        maxElevation: number;
        minElevation: number;
        averageSpeed: number;
        averageMovingSpeed: number;
        maxSpeed: number;
        calories: number;
        averageHR: number;
        maxHR: number;
        averageRunCadence: number;
        maxRunCadence: number;
        averageTemperature: number;
        maxTemperature: number;
        minTemperature: number;
        groundContactTime: number;
        groundContactBalanceLeft: number;
        strideLength: number;
        verticalOscillation: number;
        trainingEffect: number;
        anaerobicTrainingEffect: number;
        aerobicTrainingEffectMessage: string;
        anaerobicTrainingEffectMessage: string;
        verticalRatio: number;
        endLatitude: number;
        endLongitude: number;
        maxVerticalSpeed: number;
        minActivityLapDuration: number;
    };
    locationName: string;
    splitSummaries?:
        | {
              distance: number;
              duration: number;
              movingDuration: number;
              elapsedDuration: number;
              elevationGain: number;
              elevationLoss: number;
              averageSpeed: number;
              averageMovingSpeed: number;
              maxSpeed: number;
              calories: number;
              averageHR: number;
              maxHR: number;
              averageRunCadence: number;
              maxRunCadence: number;
              averageTemperature: number;
              maxTemperature: number;
              minTemperature: number;
              groundContactTime: number;
              groundContactBalanceLeft: number;
              strideLength: number;
              verticalOscillation: number;
              verticalRatio: number;
              totalExerciseReps: number;
              splitType: string;
              noOfSplits: number;
              maxElevationGain: number;
              averageElevationGain: number;
              maxDistance: number;
          }[]
        | null;
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

export interface IOauth1 {
    token: IOauth1Token;
    oauth: OAuth;
}

export interface IOauth1Token {
    oauth_token: string;
    oauth_token_secret: string;
}

export interface IOauth2Token {
    scope: string;
    jti: string;
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: number;

    // added
    expires_at?: number;
    refresh_token_expires_at?: number;
}
