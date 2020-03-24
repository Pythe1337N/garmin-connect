const GC_MODERN = 'https://connect.garmin.com/modern';
const GARMIN_SSO = 'https://sso.garmin.com/sso';
const BASE_URL = `${GC_MODERN}/proxy`;
const SIGNIN_URL = `${GARMIN_SSO}/signin`;
const LOGIN_URL = `${GARMIN_SSO}/login`;

const ACTIVITY_SERVICE = `${BASE_URL}/activity-service`;
const ACTIVITYLIST_SERVICE = `${BASE_URL}/activitylist-service`;
const CURRENT_USER_SERVICE = `${GC_MODERN}/currentuser-service/user/info`;
const DEVICE_SERVICE = `${BASE_URL}/device-service`;
const USERPROFILE_SERVICE = `${BASE_URL}/userprofile-service`;
const WELLNESS_SERVICE = `${BASE_URL}/wellness-service`;
const WORKOUT_SERVICE = `${BASE_URL}/workout-service`;

const USER_SETTINGS = `${USERPROFILE_SERVICE}/userprofile/user-settings/`;

const activity = (id) => `${ACTIVITY_SERVICE}/activity/${id}/details`;

const activities = () => `${ACTIVITYLIST_SERVICE}/activities/search/activities`;

const dailyHeartRate = (userHash) => `${WELLNESS_SERVICE}/wellness/dailyHeartRate/${userHash}`;

const dailySleep = () => `${WELLNESS_SERVICE}/wellness/dailySleep`;

const dailySleepData = (userHash) => `${WELLNESS_SERVICE}/wellness/dailySleepData/${userHash}`;

const dailySummaryChart = (userHash) => `${WELLNESS_SERVICE}/wellness/dailySummaryChart/${userHash}`;

const deviceInfo = (userHash) => `${DEVICE_SERVICE}/deviceservice/device-info/all/${userHash}`;

const schedule = (id) => `${WORKOUT_SERVICE}/schedule/${id}`;

const userInfo = () => CURRENT_USER_SERVICE;

const userSettings = () => USER_SETTINGS;

const workout = (id) => {
    if (id) {
        return `${WORKOUT_SERVICE}/workout/${id}`;
    }
    return `${WORKOUT_SERVICE}/workout`;
};

const workouts = () => `${WORKOUT_SERVICE}/workouts`;

module.exports = {
    GC_MODERN,
    GARMIN_SSO,
    BASE_URL,
    SIGNIN_URL,
    LOGIN_URL,
    CURRENT_USER_SERVICE,
    USERPROFILE_SERVICE,
    WELLNESS_SERVICE,
    WORKOUT_SERVICE,
    activity,
    activities,
    dailyHeartRate,
    dailySleep,
    dailySleepData,
    dailySummaryChart,
    deviceInfo,
    schedule,
    userInfo,
    userSettings,
    workout,
    workouts,
};
