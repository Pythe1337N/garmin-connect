const { GarminConnect } = require('../dist/index');

// Has to be run in an async function to be able to use the await keyword
const main = async () => {
    // Create a new Garmin Connect Client
    const GCClient = new GarminConnect({
        username: 'your-email',
        password: 'your-password'
    });

    // TODO: Test China Domain
    // China Domain
    // const GCClient = new GarminConnect({
    //     username: 'your-email',
    //     password: 'your-password'
    // }, 'garmin.cn');

    // Uses credentials from garmin.config.json or uses supplied params
    await GCClient.login();

    // // Get user info
    // const info = await GCClient.getUserInfo();

    // Log info to make sure signin was successful
    // console.log(info);
    // // Get user settings
    const settings = await GCClient.getUserSettings();

    // Log info to make sure signin was successful
    console.log(settings);
};

// Run the code
main();
