//import UncontrolledExample from '../Components/Carousel';
//import PriceList from '../PriceList/PriceList';
//import './KuvaGalleria.css'
import React from 'react';
import Galleri from '../Gallery/Gallery';

function Kuvat() {
    
    const kuvat = ["/newImaiges/kuvaVlad1.png", "/newImaiges/kuvaVlad2.png", "/newImaiges/kuvaVlad3.png", "/newImaiges/kuvaVlad4.png", "/newImaiges/kuvaVlad5.png", "/newImaiges/kuvaVlad6.png", "/newImaiges/kuvaVlad7.png", "/newImaiges/kuvaVlad8.png", "/newImaiges/kuvaVlad9.png", "/newImaiges/kuvaVlad10.png", "/newImaiges/kuvaVlad11.png", "/newImaiges/kuvaVlad12.png", "/newImaiges/kuvaVlad13.png", "/newImaiges/kuvaVlad14.png", "/newImaiges/kuvaVlad15.png", "/newImaiges/kuvaVlad16.png",
        "/newImaiges/kuvaVlad17.png", "/newImaiges/kuvaVlad18.png", "/newImaiges/kuvaVlad19.png", "/newImaiges/kuvaVlad20.png", "/newImaiges/kuvaVlad21.png", "/newImaiges/kuvaVlad22.png"]


    return (
        <>
           
            <h1 style={{paddingTop:"100px"}}>
       test
            </h1>
            <Galleri kuvat={kuvat}/>
        </>

    );
}

export default Kuvat;












