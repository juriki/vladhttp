import React from 'react';
import './Kuvat.css'
import { useState } from 'react';
import Galleri from '../Gallery/Gallery';
import PhotoGallery from '../droopboxGallery/PhotoGallery';


function Kuvat() {
    const [isKuvaShow, setIsKuvaShow] = useState(false);
    const [kuvaData, setKuvaData] = useState(''); // Исправлено начальное значение

    const kylppari = ["/newImaigesTN/kyllpySauna1.png", "/newImaigesTN/kyllpySauna2.png", "/newImaigesTN/kyllpySauna3.png", "/newImaigesTN/kyllpySauna4.png",  "/newImaigesTN/kyllpySauna5.png", "/newImaigesTN/kyllpySauna6.png"];
    const toiletSuhkku = ["/newImaigesTN/toiletSuhku1.png", "/newImaigesTN/toiletSuhku2.png", "/newImaigesTN/toiletSuhku3.png", "/newImaigesTN/toiletSuhku4.png"];
    const keittio = ["/newImaigesTN/ketio1.png", "/newImaigesTN/ketio2.png", "/newImaigesTN/ketio3.png", "/newImaigesTN/ketio4.png", "/newImaigesTN/ketio5.png"];
    const bedRoom = ["/newImaigesTN/bed2Room1.png", "/newImaigesTN/bed2Room2.png", "/newImaigesTN/bedRoom1.png", "/newImaigesTN/bedRoom2.png"];
    const stairs = ["/newImaigesTN/stairs1.png", "/newImaigesTN/stairs2.png"];
    const huoseOut = ["/newImaigesTN/HousOutDoor1.png", "/newImaigesTN/HousOutDoor2.png", "/newImaigesTN/HousOutDoor3.png"];
    const terassi = ["/newImaigesTN/terassa1.png", "/newImaigesTN/terassa2.png"];
    const katto = ["/newImaigesTN/katto1.png", "/newImaigesTN/katto2.png"];
    const smalHouse = ["/newImaigesTN/smallHouse1.png", "/newImaigesTN/smallHouse2.png"];

    const handlerPhotoClick = (imagename) => {
        let newURl = imagename.slice(14, imagename.length); // Исправлено 'lenght' -> 'length'
        console.log(newURl);
        newURl = "/newImaiges/" + newURl;
        setKuvaData(newURl);
        setIsKuvaShow(true);
    };

    function delteImage() {
        setKuvaData('');
        setIsKuvaShow(false);
    }

    return (
        <>
            <h1 style={{ paddingTop: "100px" }}>
            </h1>
            {!isKuvaShow &&
                <div>
                    <Galleri kuvat={kylppari} tyoNimi={'Kylpyhuone'} onPhotoClick={handlerPhotoClick} />
                    <Galleri kuvat={toiletSuhkku} onPhotoClick={handlerPhotoClick} />
                    <Galleri kuvat={keittio} tyoNimi={'Keittiö'} onPhotoClick={handlerPhotoClick} />
                    <Galleri kuvat={bedRoom} tyoNimi={'Makuhuone'} onPhotoClick={handlerPhotoClick} />
                    <Galleri kuvat={stairs} tyoNimi={'Portatiden saneeraus'} onPhotoClick={handlerPhotoClick} />
                    <Galleri kuvat={huoseOut} tyoNimi={'Julkisivut'} onPhotoClick={handlerPhotoClick} />
                    <Galleri kuvat={katto} tyoNimi={'Kattoremontti'} onPhotoClick={handlerPhotoClick} />
                    <Galleri kuvat={terassi} tyoNimi={'Terassi'} onPhotoClick={handlerPhotoClick} />
                    <Galleri kuvat={smalHouse} tyoNimi={'Pienrakennus'} onPhotoClick={handlerPhotoClick} />
                </div>
            }
            {isKuvaShow &&
                <div className='imageDivKuvat'>
                    <img className='kuva' src={kuvaData} onClick={delteImage} alt='Kuva' />
              
                </div>}
                <PhotoGallery></PhotoGallery>
        </>
    );
}

export default Kuvat;
