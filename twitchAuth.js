require('dotenv').config();
const axios = require('axios');

let twitchAccessToken = null;

const TWITCH_TOKEN_URL = `https://id.twitch.tv/oauth2/token`;

async function refreshTwitchToken() {
    try {
        const response = await axios.post(TWITCH_TOKEN_URL, null, {
            params: {
                client_id: process.env.JONATHAN_TWITCH_CLIENT_ID,
                client_secret: process.env.JONATHAN_TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });

        twitchAccessToken = response.data.access_token;
        console.log("New Twitch Token:", twitchAccessToken);

        return twitchAccessToken;
    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        return null;
    }
}

async function getTwitchToken() {
    console.log("Access Token in getTwitchToken():", twitchAccessToken);
    return twitchAccessToken || refreshTwitchToken();
}

module.exports = { refreshTwitchToken, getTwitchToken }