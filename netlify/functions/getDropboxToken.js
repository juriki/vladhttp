require('dotenv').config(); // Подключаем dotenv для загрузки переменных окружения из .env

export async function handler(event) {
  const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;
  const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY;
  const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET;
  console.log("DROPBOX_REFRESH_TOKEN:", DROPBOX_REFRESH_TOKEN);
  console.log("DROPBOX_APP_KEY:", DROPBOX_APP_KEY);
  console.log("DROPBOX_APP_SECRET:", DROPBOX_APP_SECRET);
  
  if (!DROPBOX_REFRESH_TOKEN || !DROPBOX_APP_KEY || !DROPBOX_APP_SECRET) {
    console.error("Ошибка: Dropbox API keys are missing");
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
    console.error("Ошибка при запросе к Dropbox API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
