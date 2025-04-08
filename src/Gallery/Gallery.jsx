import React from 'react';
import './Gallery.css';
import LazyImage from '../droopboxGallery/LazyImage';

function Galleri({ tyoNimi, kuvat, onPhotoClick }) {
    return (
        <>
            <meta name='robots' content='index , follow' />
            <h3 style={{ textAlign: 'center' }}>{tyoNimi}</h3>
            <div className='galleryMainDiv'>
                {kuvat.length === 0 ? (
                    <p>Загрузка изображений...</p>
                ) : (
                    kuvat.map((kuva, index) => (
                        <div className='galleryDiv1' key={index}>                   
                            <img className='gallery' 
                                 src={kuva} 
                                 alt={`Фото ${index}`} 
                                 onClick={() => onPhotoClick(kuva)} 
                                 style={{ cursor: 'pointer' }} 
                            />    
                        </div>
                    ))
                )}
            </div>
            <hr style={{ borderWidth: '3px' }}/>
        </>
    );
}

export default Galleri;
