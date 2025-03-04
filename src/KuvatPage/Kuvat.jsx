import React from 'react';
import './Kuvat.css'
import { useState } from 'react';
import Galleri from '../Gallery/Gallery';
import PhotoGallery from '../droopboxGallery/PhotoGallery';

function Kuvat() {
    const [isKuvaShow, setIsKuvaShow] = useState(false);
    const [kuvaData, setKuvaData] = useState('');

    const handlerPhotoClick = (imagename) => {
        setKuvaData(imagename);
        setIsKuvaShow(true);
    };

    function deleteImage() {
        setKuvaData('');
        setIsKuvaShow(false);
    }

    return (
        <>
            <h1 style={{ paddingTop: "100px" }}></h1>
            {!isKuvaShow &&
                <div>
                    <PhotoGallery onPhotoClick={handlerPhotoClick} />
                </div>
            }
            {isKuvaShow &&
                <div className='imageDivKuvat'>
                    <img className='kuva' src={kuvaData} onClick={deleteImage} alt='Kuva' />
                </div>}
        </>
    );
}

export default Kuvat;























