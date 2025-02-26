import React, { useState, useEffect } from 'react';

const ACCESS_TOKEN = ''
const PhotoGallery = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  // Функция для получения файлов из Dropbox
  const fetchDropboxFiles = async () => {
    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: 'home/Apps/VladHttp' // Убедитесь, что этот путь правильный
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка при получении файлов: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log(data);
      setFiles(data.entries); // Сохраняем файлы в state
    } catch (error) {
      console.error('Error:', error);
      setError(`Ошибка при получении файлов: ${error.message}`);
    }
  };

  // Загружаем файлы при монтировании компонента
  useEffect(() => {
    fetchDropboxFiles();
  }, []);

  return (
    <div>
      <h1>Галерея Dropbox</h1>

      {error && <p>{error}</p>}

      {files.length === 0 ? (
        <p>Загружаем файлы...</p>
      ) : (
        <div className="gallery">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <img src={file.thumbnail_url} alt={file.name} />
              <p>{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
