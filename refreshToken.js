const { refreshTwitchToken } = require('./twitchAuth');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const newToken = await refreshTwitchToken();
        if (!newToken) {
            return res.status(500).json({ error: "Failed to refresh token" });
        }
        return res.status(200).json({ access_token: newToken });
    }
    res.status(405).json({ error: "Method not allowed" });
}