const { GarminConnect } = require('garmin-connect');

// Has to be run in an async function to be able to use the await keyword
const main = async () => {
    // Create a new Garmin Connect Client
    const GCClient = new GarminConnect();

    // Uses credentials from garmin.config.json or uses supplied params
    await GCClient.login('my.email@example.com', 'MySecretPassword');

    // Get user info
    const info = await GCClient.getUserInfo();

    // Log info to make sure signin was successful
    console.log(info);
};

// Run the code
main();
