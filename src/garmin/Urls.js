const GC_MODERN = 'https://connect.garmin.com/modern';
const GARMIN_SSO = 'https://sso.garmin.com/sso';
const BASE_URL = `${GC_MODERN}/proxy`;
const SIGNIN_URL = `${GARMIN_SSO}/signin`;
const LOGIN_URL = `${GARMIN_SSO}/login`;

const CURRENT_USER_SERVICE = `${GC_MODERN}/currentuser-service/user/info`
const USERPROFILE_SERVICE = `${BASE_URL}/userprofile-service`;
const WELLNESS_SERVICE = `${BASE_URL}/wellness-service`;
const WORKOUT_SERVICE = `${BASE_URL}/workout-service`;

const USER_SETTINGS = `${USERPROFILE_SERVICE}/userprofile/user-settings/`;

const dailyHeartRate = (userHash) => {
    return `${WELLNESS_SERVICE}/wellness/dailyHeartRate/${userHash}`;
}

const userInfo = () => {
    return CURRENT_USER_SERVICE;
}

const userSettings = () => {
    return USER_SETTINGS;
}


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
    dailyHeartRate,
    userInfo,
    userSettings
}