import React, { useState, useEffect } from 'react';
import Galleri from '../Gallery/Gallery';

const ACCESS_TOKEN = 'sl.u.AFlJS_NT2Qy71RPOG1h-9bMzTZNQ443BGmHXL_BCMmhe6uNtP64v7bwqzT73792jXhQsaWz06yeXty6A7ooDw2ZzPnWu_gv75wS1e6By9ghd0OhmFQy_JYdHRvXxdb21Zmupds4w4MHV3Od_--x5qww7FAMv0ibDhTSRzd_oWtowxFDRAGodf950g2Onciz212TdndCn7d3JfTAnRWROveiR3OICXi-LQNq9119GoMEB2m1aVK1v8X_VjZ0ri4XlGbWilfvajhYgt7Jb1mAbvDM1T358hob-0p4rdUiqfnsjDU5YIparxMvJ1kwaW0qJuBeOIyjyF3gof3d6qpqqOWJxin9fCiL_vLsvziKVR4znhUb-paciSOtPRd3JEdC2LrOdaMusdctQOxcqTgf8OmTTZA_qFVpU4Af_dTam_ykdwBFUewMEK0yz_ZUEyav43wVhx_dCX0WODbtlkfelx9scXUsD0tGQrku5HSIhXLnhJ7uRqPLHOVCtP8hhDQWlBQk0BB45sBHKyItkYqkTLUDTDypKD59PVBU0oakvxgie6nWHNMM0f642fgtiFUxyxL-nzpXqJ0eCBWVXh7G4xzwzfBsqFf3yYuw9m778n6S7Gn5CjCBV2Rm-qkftklkIMhG7BeMQks6lnLvVP0Jjs3W2h9AiA3jDDOQEKrbfFe-1V3xZbJS6o4HfeScca2Qi777w-2GFpla0TnQ2Ssc0Mt3I5cvKKY_yQCj1mfS0xyn0EVLSd3dgU3LEQgWphSHfxlAP4ial8VgJw_WD74VMysoK5ukbgyVvtapUseN0VGUkNUTLZxeirvUuUA3GsgPlGiUdil4oVbAitQtOvETtffUanXOYjOIn5p_ByDqB0Ua7PVoF7rP1W10y_dbMUNi6x5YySkuPUJ8opCPdHszD9rAPkuFJX_VvOn2ftFjCu7H8psn3sVZM5u1wcSzr4pMmHvdZcuGp4WVvWZNClaPPIyMDbp3cH9Rf8zWkswQCMaBu9exQ9rT7B0rCaeNQt7Fs9LIp6_jfFrdkFKUdSiiahHkKuZlWYwPSyT3xlZpq8QbnHxhsIlU6q3ElpNJVQ51fttQ2W0iIQDhPU7v3OPHK_PTXyy7kIAq3jjIQSJDxZCom3SOk-VgrZP7CW8OrpTi2VTBKKzGOHmRL6crgRevofknczSDmA1e0X-uvQ868qgauxPWzpgffQ0Yvb6pdyE9KhX8cK2fxmiuuz1xlxvJrpXzmJx1SewsLOrVeM-ybw98xZRThuqikU02AzCMAENWwkfvEGbe7GSbVMUTdsv_SGr7FHmQRWUU4cPxqLio0qPkqUQ'



const PhotoGallery = ({ onPhotoClick }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const fetchFolders = async () => {
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
      setError(`Virhe lataamisessa: ${error.message}`);
    }
  };

  const fetchPhotos = async (folderPath) => {
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
      console.error(`Virhe lataamisessa tiedostoista ${folderPath}:`, error);
      return [];
    }
  };

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
      console.error(`Virhe lataamisessa linkkiä tiedostolle ${filePath}:`, error);
      return "";
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {categories.length === 0 ? (
        <p>Ladataan tiedostoja...</p> 
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