import { GCActivityId } from './Urls';

export type GCUserProfileId = number;
export type GCUserHash = string;

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
}
