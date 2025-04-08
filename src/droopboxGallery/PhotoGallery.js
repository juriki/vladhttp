import React, { useState, useEffect, useCallback } from 'react';
import Galleri from '../Gallery/Gallery';

// Функция для получения access_token с бэкенда Netlify
const getAccessToken = async () => {
  try {
    console.log("Запрос токена с Netlify Functions");
    const response = await fetch('/.netlify/functions/getDropboxToken');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.access_token;
  } catch (error) {
    console.error("Ошибка получения токена:", error);
    return null;
  }
};

// Функция для получения временной ссылки на файл
const getTemporaryLink = async (filePath, accessToken) => {
  try {
    const response = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: filePath }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || 'Ошибка получения ссылки');

    return data.link;
  } catch (error) {
    console.error(`Ошибка загрузки ссылки для файла ${filePath}:`, error);
    return "";
  }
};

// Функция для очистки названия папки от числа и пробела
const cleanFolderName = (name) => {
  return name.replace(/^\d+\s+/, '');
};

// Глобальный флаг для предотвращения повторных запросов токена
let hasFetchedToken = false;

const PhotoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Получение токена один раз при монтировании
  useEffect(() => {
    const fetchToken = async () => {
      if (hasFetchedToken) return;
      hasFetchedToken = true;
      const token = await getAccessToken();
      if (token) {
        console.log("Токен получен:", token);
        setAccessToken(token);
      } else {
        setError("Pääsytunnuksen hakeminen epäonnistui");
      }
    };
    fetchToken();
  }, []);

  // Функция для загрузки фотографий из одной папки
  const fetchPhotos = useCallback(async (folderPath) => {
    if (!accessToken) return [];

    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: folderPath }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error_description || 'Ошибка загрузки фотографий');

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const imageFiles = data.entries.filter(file =>
        file[".tag"] === "file" && imageExtensions.some(ext => file.name.endsWith(ext))
      );

      const photos = await Promise.all(
        imageFiles.map(async (file) => {
          const link = await getTemporaryLink(file.path_lower, accessToken);
          return { name: file.name, link };
        })
      );

      return photos;
    } catch (error) {
      console.error(`Ошибка загрузки файлов из ${folderPath}:`, error);
      return [];
    }
  }, [accessToken]);

  // Функция для загрузки всех папок с прогрессивным обновлением
  const fetchFolders = useCallback(async () => {
    if (!accessToken) return;

    try {
      console.log("Загрузка списка папок из /Apps");
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/Apps' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error_description || 'Ошибка загрузки папок');

      const folders = data.entries.filter(item => item[".tag"] === "folder");

      folders.sort((a, b) => a.name.localeCompare(b.name));

      for (const folder of folders) {
        console.log(`Загрузка папки: ${folder.name}`);
        const photos = await fetchPhotos(folder.path_lower);
        setCategories(prev => {
          if (prev.some(cat => cat.name === folder.name)) return prev;
          return [...prev, { name: folder.name, photos }];
        });
      }
    } catch (error) {
      setError(`Latausvirhe: ${error.message}`);
    }
  }, [fetchPhotos, accessToken]);

  // Запуск загрузки после получения токена
  useEffect(() => {
    if (accessToken) {
      console.log("Запуск fetchFolders");
      fetchFolders();
    }
  }, [fetchFolders, accessToken]);

  // Обработчик клика по фото
  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {categories.length === 0 && !error ? (
        <p>Kuvien lataaminen...</p>
      ) : (
        categories.map((category, index) => (
          <div key={index}>
            <Galleri
              kuvat={category.photos.map(photo => photo.link)}
              tyoNimi={cleanFolderName(category.name)}
              onPhotoClick={handlePhotoClick}
            />
          </div>
        ))
      )}

      {/* Модальное окно для увеличенного фото */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <img
            src={selectedPhoto}
            alt="Увеличенное фото"
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
          />
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px',
              backgroundColor: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Sulje
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;