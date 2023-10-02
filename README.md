# garmin-connect

## v1.6.0 refactor

TODO:

-   [x] New HttpClient class
-   [x] Login and get user token
-   [x] Garmin URLs works with `garmin.cn` and `garmin.com`
-   [x] Auto refresh Ouath2 token
-   [x] Oauth1,Oauth2 token import and export.
-   [x] Download Activity, countActivities, getActivities, getActivity, getUserProfile, getUserSettings
-   [x] Upload Activity, delete Activity
-   [ ] Implementation of other methods, such as Badge,Workout,Gear etc
-   [ ] Handle MFA
-   [x] Handle Account locked
-   [ ] Unit test
-   [ ] Listeners

If something is not working, please check [https://connect.garmin.com/status/](https://connect.garmin.com/status/) first.

Currently, most of previous features are working, but some of Rest API are not added, such as `Gear`,`Workout`,`Badge` etc. So if you need these features, please add a PR.

All of above work inspired by [https://github.com/matin/garth](https://github.com/matin/garth). Many thanks.

---

A powerful JavaScript library for connecting to Garmin Connect for sending and receiving health and workout data. It comes with some predefined methods to get and set different kinds of data for your Garmin account, but also have the possibility to make [custom requests](#custom-requests) `GET`, `POST` and `PUT` are currently supported. This makes it easy to implement whatever may be missing to suite your needs.

## Prerequisites

This library will require you to add a configuration file to your project root called `garmin.config.json` containing your username and password for the Garmin Connect service.

```json
{
    "username": "my.email@example.com",
    "password": "MySecretPassword"
}
```

## How to install

```shell
$ npm install garmin-connect
```

## How to use

```js
const { GarminConnect } = require('garmin-connect');
// Create a new Garmin Connect Client
const GCClient = new GarminConnect({
    username: 'my.email@example.com',
    password: 'MySecretPassword'
});
// Uses credentials from garmin.config.json or uses supplied params
await GCClient.login();
const userProfile = await GCClient.getUserProfile();
```

Now you can check `userProfile.userName` (userName is your email address) to verify that your login was successful.

## Reusing your session(since v1.6.0)

### Save token to file and reuse it.

```js
GCClient.saveTokenToFile('/path/to/save/tokens');
```

Result:

```bash
$ ls /path/to/save/tokens
oauth1_token.json oauth2_token.json
```

Reuse token:

```js
GCClient.loadTokenByFile('/path/to/save/tokens');
```

### Or just save your token to db or other storage.

```js
const oauth1 = GCClient.client.oauth1Token;
const oauth2 = GCClient.client.oauth2Token;
// save to db or other storage
...
```

Reuse token:

```js
GCClient.loadToken(oauth1, oauth2);
```

## Reusing your session(depreated)

This is an experimental feature and might not yet provide full stability.

After a successful login the `sessionJson` getter and setter can be used to export and restore your session.

```js
// Exporting the session
const session = GCClient.sessionJson;

// Use this instead of GCClient.login() to restore the session
// This will throw an error if the stored session cannot be reused
GCClient.restore(session);
```

The exported session should be serializable and can be stored as a JSON string.

A stored session can only be reused once and will need to be stored after each request. This can be done by attaching some storage to the `sessionChange` event.

```js
GCClient.onSessionChange((session) => {
    /*
        Your choice of storage here
        node-persist will probably work in most cases 
     */
});
```

### Login fallback

To make sure to use a stored session if possible, but fallback to regular login, one can use the `restoreOrLogin` method.
The arguments `username` and `password` are both optional and the regular `.login()` will be
called if session restore fails.

```js
await GCClient.restoreOrLogin(session, username, password);
```

## Events

-   `sessionChange` will trigger on a change in the current `sessionJson`

To attach a listener to an event, use the `.on()` method.

```js
GCClient.on('sessionChange', (session) => console.log(session));
```

There's currently no way of removing listeners.

## Reading data

### User info

Receive basic user information

```js
GCClient.getUserInfo();
```

### Social Profile

Receive social user information

```js
GCClient.getSocialProfile();
```

### Social Connections

Get a list of all social connections

```js
GCClient.getSocialConnections();
```

### Device info

Get a list of all registered devices including model numbers and firmware versions.

```js
GCClient.getDeviceInfo();
```

### Activities

To get a list of recent activities, use the `getActivities` method. This function takes two arguments, _start_ and _limit_, which is used for pagination. Both are optional and will default to whatever Garmin Connect is using. To be sure to get all activities, use this correctly.

```js
// Get a list of default length with most recent activities
GCClient.getActivities();
// Get activities 10 through 15. (start 10, limit 5)
GCClient.getActivities(10, 5);
```

### Activity details

Use the activityId to get activity details.

```js
// search for the activity (optional)
const [activity] = await GCClient.getActivities(0, 1);
// get the activity details
const activityDetails = await GCClient.getActivityDetails(activity.activityId);
```

### Activity metrics details

Use the activityId to get metrics details about that specific activity.

```js
const activities = await GCClient.getActivities(0, 1);
const id = activities[0].activityId;
// Use the id as a parameter
GCClient.getActivity({ activityId: id });
// Or the whole activity response
GCClient.getActivity(activities[0]);
```

### Activities

To get a list of activities in your news feed, use the `getNewsFeed` method. This function takes two arguments, _start_ and _limit_, which is used for pagination. Both are optional and will default to whatever Garmin Connect is using. To be sure to get all activities, use this correctly.

```js
// Get the news feed with a default length with most recent activities
GCClient.getNewsFeed();
// Get activities in feed, 10 through 15. (start 10, limit 5)
GCClient.getNewsFeed(10, 5);
```

### Download original activity data

Use the activityId to download the original activity data. Usually this is supplied as a .zip file.

```js
const [activity] = await GCClient.getActivities(0, 1);
// Directory path is optional and defaults to the current working directory.
// Downloads filename will be supplied by Garmin.
GCClient.downloadOriginalActivityData(activity, './some/path/that/exists');
```

### Upload activity file

Uploads an activity file as a new Activity. The file can be a `gpx`, `tcx`, or `fit` file. If the activity already exists, the result will have a status code of 409.
Upload fixed in 1.4.4, Garmin changed the upload api, the response `detailedImportResult` doesn't contain the new activityId.

```js
const upload = await GCClient.uploadActivity('./some/path/to/file.fit');
// not working
const activityId = upload.detailedImportResult.successes[0].internalId;
const uploadId = upload.detailedImportResult.uploadId;
```

### Upload activity image

Uploads an image to activity

```js
const [latestActivty] = await GCClient.getActivities(0, 1);

const upload = await GCClient.uploadImage(
    latestActivty,
    './some/path/to/file.jpg'
);
```

### Delete activity image

Delete an image from activity

```js
const [activity] = await GCClient.getActivities(0, 1);
const activityDetails = await GCClient.getActivityDetails(activity.activityId);

await GCClient.deleteImage(
    activity,
    activityDetails.metadataDTO.activityImages[0].imageId
);
```

### Step count

Get timestamp and number of steps taken for a specific date.

```js
// This will default to today if no date is supplied
const steps = await GCClient.getSteps(new Date('2020-03-24'));
```

### Heart rate

Get heart rate for a specific date.

```js
// This will default to today if no date is supplied
const heartRate = await GCClient.getHeartRate(new Date('2020-03-24'));
```

### Sleep summary

Get the summary of how well you've slept for a specific date.

```js
// This will default to today if no date is supplied
const sleep = await GCClient.getSleep(new Date('2020-03-24'));
```

### Detailed sleep data

Get the details of your sleep for a specific date.

```js
// This will default to today if no date is supplied
const detailedSleep = await GCClient.getSleepData(new Date('2020-03-24'));
```

## Modifying data

### Update activity

```js
const activities = await GCClient.getActivities(0, 1);
const activity = activities[0];
activity['activityName'] = 'The Updated Name';
await GCClient.updateActivity(activity);
```

### Delete an activity

Deletes an activty.

```js
const activities = await GCClient.getActivities(0, 1);
const activity = activities[0];
await GCClient.deleteActivity(activity);
```

### Add weight

To add a new weight measurement, use `setBodyWeight`. Here you specify your weight in _kg_.

```js
GCClient.setBodyWeight(81.4);
```

Will set your current weight to 81.4kg. The unit used might be tied to your preferred weight settings.

### Add workout

To add a custom workout, use the `addWorkout` or more specifically `addRunningWorkout`.

```js
GCClient.addRunningWorkout('My 5k run', 5000, 'Some description');
```

Will add a running workout of 5km called 'My 5k run' and return a JSON object representing the saved workout.

### Schedule workout

To add a workout to your calendar, first find your workout and then add it to a specific date.

```js
const workouts = await GCClient.getWorkouts();
const id = workouts[0].workoutId;
GCClient.scheduleWorkout({ workoutId: id }, new Date('2020-03-24'));
```

This will add the workout to a specific date in your calendar and make it show up automatically if you're using any of the Garmin watches.

### Delete workout

Deleting a workout is very similar to [scheduling](#schedule-workout) one.

```js
const workouts = await GCClient.getWorkouts();
const id = workouts[0].workoutId;
GCClient.deleteWorkout({ workoutId: id });
```

## Custom requests

This library will handle custom requests to your active Garmin Connect session. There are a lot of different url's that is used, which means that this library probably wont cover them all. By using the network analyze tool you can find url's that are used by Garmin Connect to fetch data.

Let's assume I found a `GET` requests to the following url:

```
https://connect.garmin.com/modern/proxy/wellness-service/wellness/dailyHeartRate/22f5f84c-de9d-4ad6-97f2-201097b3b983?date=2020-03-24
```

The request can be sent using `GCClient` by running

```js
// You can get your displayName by using the getUserInfo method;
const displayName = '22f5f84c-de9d-4ad6-97f2-201097b3b983';
const url =
    'https://connect.garmin.com/modern/proxy/wellness-service/wellness/dailyHeartRate/';
const dateString = '2020-03-24';
GCClient.get(url + displayName, { date: dateString });
```

and will net you the same result as using the provided way

```js
GCClient.getHeartRate();
```

Notice how the client will keep track of the url's, your user information as well as keeping the session alive.

## Limitations

Many responses from Garmin Connect are missing type definitions and defaults to `unknown`. Feel free to add types by opening a pull request.

For now, this library only supports the following:

-   Get user info
-   Get social user info
-   Get heart rate
-   Set body weight
-   Get list of workouts
-   Add new workouts
-   Add workouts to you calendar
-   Remove previously added workouts
-   Get list of activities
-   Get details about one specific activity
-   Get the step count
-   Get earned badges
-   Get available badges
-   Get details about one specific badge
