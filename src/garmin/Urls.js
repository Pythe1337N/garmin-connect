const GC_MODERN = 'https://connect.garmin.com/modern';
const GARMIN_SSO_ORIGIN = 'https://sso.garmin.com';
const GARMIN_SSO = `${GARMIN_SSO_ORIGIN}/sso`;
const BASE_URL = `${GC_MODERN}/proxy`;
const SIGNIN_URL = `${GARMIN_SSO}/signin`;
const LOGIN_URL = `${GARMIN_SSO}/login`;

const ACTIVITY_SERVICE = `${BASE_URL}/activity-service`;
const ACTIVITYLIST_SERVICE = `${BASE_URL}/activitylist-service`;
const CURRENT_USER_SERVICE = `${GC_MODERN}/currentuser-service/user/info`;
const DEVICE_SERVICE = `${BASE_URL}/device-service`;
const DOWNLOAD_SERVICE = `${BASE_URL}/download-service`;
const USERPROFILE_SERVICE = `${BASE_URL}/userprofile-service`;
const WELLNESS_SERVICE = `${BASE_URL}/wellness-service`;
const WORKOUT_SERVICE = `${BASE_URL}/workout-service`;
const UPLOAD_SERVICE = `${BASE_URL}/upload-service`;

const USER_SETTINGS = `${USERPROFILE_SERVICE}/userprofile/user-settings/`;

const activity = (id) => `${ACTIVITY_SERVICE}/activity/${id}`;

const weather = (id) => `${activity(id)}/weather`;

const activityDetails = (id) => `${activity(id)}/details`;

const activities = () => `${ACTIVITYLIST_SERVICE}/activities/search/activities`;

const dailyHeartRate = (userHash) => `${WELLNESS_SERVICE}/wellness/dailyHeartRate/${userHash}`;

const dailySleep = () => `${WELLNESS_SERVICE}/wellness/dailySleep`;

const dailySleepData = (userHash) => `${WELLNESS_SERVICE}/wellness/dailySleepData/${userHash}`;

const dailySummaryChart = (userHash) => `${WELLNESS_SERVICE}/wellness/dailySummaryChart/${userHash}`;

const deviceInfo = (userHash) => `${DEVICE_SERVICE}/deviceservice/device-info/all/${userHash}`;

const schedule = (id) => `${WORKOUT_SERVICE}/schedule/${id}`;

const userInfo = () => CURRENT_USER_SERVICE;

const socialProfile = (userHash) => `${USERPROFILE_SERVICE}/socialProfile/${userHash}`;

const userSettings = () => USER_SETTINGS;

const originalFile = (id) => `${DOWNLOAD_SERVICE}/files/activity/${id}`;

/**
 *
 * @param id {string}
 * @param type "tcx" | "gpx" | "kml"
 * @return {`${string}/export/${string}/activity/${string}`}
 */
const exportFile = (id, type) => `${DOWNLOAD_SERVICE}/export/${type}/activity/${id}`;

const workout = (id) => {
    if (id) {
        return `${WORKOUT_SERVICE}/workout/${id}`;
    }
    return `${WORKOUT_SERVICE}/workout`;
};

const workouts = () => `${WORKOUT_SERVICE}/workouts`;

const socialConnections = (userHash) => `${USERPROFILE_SERVICE}/socialProfile/connections/${userHash}`;

const newsFeed = () => `${ACTIVITYLIST_SERVICE}/activities/subscriptionFeed`;

const upload = (format) => `${UPLOAD_SERVICE}/upload/${format}`;

module.exports = {
    GC_MODERN,
    GARMIN_SSO_ORIGIN,
    GARMIN_SSO,
    BASE_URL,
    SIGNIN_URL,
    LOGIN_URL,
    CURRENT_USER_SERVICE,
    USERPROFILE_SERVICE,
    WELLNESS_SERVICE,
    WORKOUT_SERVICE,
    activity,
    weather,
    activityDetails,
    activities,
    dailyHeartRate,
    dailySleep,
    dailySleepData,
    dailySummaryChart,
    deviceInfo,
    schedule,
    userInfo,
    socialProfile,
    userSettings,
    workout,
    workouts,
    originalFile,
    exportFile,
    socialConnections,
    newsFeed,
    upload,
};
