import React, { useState, useEffect, useCallback } from 'react';
import Galleri from '../Gallery/Gallery';

const ACCESS_TOKEN = 'ВАШ_ACCESS_TOKEN';

const PhotoGallery = ({ onPhotoClick }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const getTemporaryLink = async (filePath) => {
    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: filePath }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));

      return data.link;
    } catch (error) {
      console.error(`Ошибка загрузки ссылки для файла ${filePath}:`, error);
      return "";
    }
  };

  const fetchPhotos = useCallback(async (folderPath) => {
    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: folderPath }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const imageFiles = data.entries.filter(file =>
        file[".tag"] === "file" && imageExtensions.some(ext => file.name.endsWith(ext))
      );

      const photos = await Promise.all(
        imageFiles.map(async (file) => {
          const link = await getTemporaryLink(file.path_lower);
          return { name: file.name, link };
        })
      );

      const subfolders = data.entries.filter(item => item[".tag"] === "folder");
      if (subfolders.length > 0) {
        const subfolderPhotos = await Promise.all(
          subfolders.map(subfolder => fetchPhotos(subfolder.path_lower))
        );
        return [...photos, ...subfolderPhotos.flat()];
      }

      return photos;
    } catch (error) {
      console.error(`Ошибка загрузки файлов из ${folderPath}:`, error);
      return [];
    }
  }, []);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/Apps' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));

      const folders = data.entries.filter(item => item[".tag"] === "folder");

      const categoriesWithPhotos = await Promise.all(
        folders.map(async (folder) => {
          const photos = await fetchPhotos(folder.path_lower);
          return { name: folder.name, photos };
        })
      );

      setCategories(categoriesWithPhotos);
    } catch (error) {
      setError(`Ошибка загрузки: ${error.message}`);
    }
  }, [fetchPhotos]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return (
    <div>
      {error && <p>{error}</p>}
      {categories.length === 0 ? (
        <p>Загрузка изображений...</p>
      ) : (
        categories.map((category, index) => (
          <div key={index}>
            <Galleri kuvat={category.photos.map(photo => photo.link)} tyoNimi={category.name} onPhotoClick={onPhotoClick} />
          </div>
        ))
      )}
    </div>
  );
};

export default PhotoGallery;
