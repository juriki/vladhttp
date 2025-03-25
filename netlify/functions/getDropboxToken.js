require('dotenv').config();
const fetch = require('node-fetch');

const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;  // Вставь свой реальный токен
const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY;  // Вставь свой APP_KEY
const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET;  // Вставь свой APP_SECRET

module.exports.handler = async function(event) {
  if (!DROPBOX_REFRESH_TOKEN || !DROPBOX_APP_KEY || !DROPBOX_APP_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Dropbox API keys are missing" }),
    };
  }

  const authHeader = `Basic ${Buffer.from(`${DROPBOX_APP_KEY}:${DROPBOX_APP_SECRET}`).toString('base64')}`;

  try {
    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: DROPBOX_REFRESH_TOKEN,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(JSON.stringify(data));

    return {
      statusCode: 200,
      body: JSON.stringify({ access_token: data.access_token }),
    };
  } catch (error) {
    console.error("Ошибка получения токена:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
