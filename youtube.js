const axios = require('axios');

// Function to check if you're live and get the video ID
async function checkIfLive(channelId, apiKey) {
  try {
    // YouTube API endpoint to search for live videos on a channel
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;

    const response = await axios.get(url);
    if (response.data.items.length > 0) {
      // If a live video is found, return the video ID
      const videoId = response.data.items[0].id.videoId;
      console.log(`You're live! Video ID: ${videoId}`);
      return videoId;
    } else {
      // If no live video is found, return null
      console.log('You are not currently live.');
      return null;
    }
  } catch (error) {
    console.error('Error checking live status or fetching video ID:', error);
    return null;
  }
}

// Function to get the live chat ID for a video
async function getLiveChatId(apiKey, videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        if (response.data.items.length > 0) {
            const liveChatId = response.data.items[0].liveStreamingDetails.activeLiveChatId;
            return liveChatId;
        } else {
            console.error("No live stream details found.");
            return null;
        }
    } catch (error) {
        console.error("Error getting live chat ID:", error);
        return null;
    }
}

// Function to start polling for chat messages
async function startPollingForChat(apiKey, liveChatId) {
    const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.items && response.data.items.length > 0) {
            response.data.items.forEach(item => {
                console.log(`[YouTube Chat] ${item.snippet.displayMessage}`);
            });
        }
    } catch (error) {
        console.error("Error fetching chat messages:", error);
    }
}

// Function to poll chat if live
async function connectYoutube(apiKey, channelId, videoId) {
    const isLive = await checkIfLive(apiKey, channelId);
    if (isLive) {
        console.log("Starting to poll for chat messages...");
        
        const liveChatId = await getLiveChatId(apiKey, videoId);
        if (liveChatId) {
            setInterval(async () => {
                await startPollingForChat(apiKey, liveChatId);
            }, 1000); // Poll every 1 second
        }
    } else {
        console.log("Stream is offline, not polling.");
    }
}

module.exports = { connectYoutube };
