import fetch from 'node-fetch';

export async function handler(event) {
  const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;
  const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY;
  const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET;

  // Проверка на наличие всех необходимых данных
  if (!DROPBOX_REFRESH_TOKEN || !DROPBOX_APP_KEY || !DROPBOX_APP_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Dropbox API keys are missing" }),
    };
  }

  // Создание заголовка авторизации для Basic Authentication
  const authHeader = `Basic ${Buffer.from(`${DROPBOX_APP_KEY}:${DROPBOX_APP_SECRET}`).toString('base64')}`;

  try {
    // Запрос для получения нового access token
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

    // Получаем и обрабатываем ответ
    const data = await response.json();

    // Если запрос не успешен, выбрасываем ошибку
    if (!response.ok) {
      throw new Error(data.error_description || 'Unknown error');
    }

    // Возвращаем новый access_token
    return {
      statusCode: 200,
      body: JSON.stringify({ access_token: data.access_token }),
    };
  } catch (error) {
    // Обработка ошибок и возврат сообщения об ошибке
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
