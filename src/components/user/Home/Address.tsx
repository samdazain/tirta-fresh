'use client';

import React from 'react';

export default function Maps() {
    return (
        <div className="relative w-[973px] h-[315px]">
            <div className="absolute -top-px left-[392px] font-bold text-[32px] tracking-[0] leading-normal bg-gradient-to-r from-[rgba(77,84,210,1)] to-[rgba(55,142,242,1)] bg-clip-text text-transparent">
                Alamat Toko
            </div>

            <div className="absolute w-[975px] h-[239px] top-[76px] left-0">
                {/* Google Maps Embed */}
                <div
                    className="absolute w-[506px] h-[239px] top-0 left-0 overflow-hidden rounded-lg"
                    style={{
                        background: 'linear-gradient(45deg, #14a4ff, #4d53d2)',
                        padding: '0.4rem',
                        boxSizing: 'border-box',
                    }}
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15819.334532385896!2d112.25664233336074!3d-7.593079058033657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e786bdba6a521c5%3A0xbbdd1e70e0d465e8!2sAgen%20Galon%20Le%20Minerale%20Tirta%20Fresh!5e0!3m2!1sid!2sid!4v1747575554771!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                        title="Lokasi Tirta Fresh"
                    ></iframe>
                </div>

                {/* Address Text */}
                <div className="absolute w-[441px] top-0.5 left-[532px] font-medium text-black text-2xl tracking-[0] leading-normal">
                    Agen Galon Le Minerale Tirta Fresh
                    <br />
                    C749+QXF, Kalianyar, Jogoroto, Kec. Jogoroto, Kabupaten Jombang, Jawa Timur
                </div>

                {/* Maps Button - Links to Google Maps */}
                <div className="absolute w-[267px] h-[62px] top-[177px] left-[532px]">
                    <a
                        href="https://maps.app.goo.gl/brgfhCbxETSRgAdUA"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="relative w-[265px] h-[62px] rounded-[20px] bg-gradient-to-r from-[rgba(77,84,210,1)] to-[rgba(55,142,242,1)] cursor-pointer hover:opacity-90 transition-opacity">
                            <div className="absolute w-36 top-[7px] left-[61px] font-normal text-white text-[32px] text-center tracking-[0] leading-normal">
                                Maps
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

// 'use client';

// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
// import 'leaflet-defaulticon-compatibility';

// // Component to access and log the map instance
// function MapController() {
//     const map = useMap();
//     console.log('map center:', map.getCenter());
//     return null;
// }

// export default function Maps() {
//     const position: [number, number] = [-7.536560, 112.276359]; // Your coordinates

//     return (
//         <div className="relative w-[973px] h-[315px]">
//             <div className="absolute -top-px left-[392px] font-bold text-[32px] tracking-[0] leading-normal bg-gradient-to-r from-[rgba(77,84,210,1)] to-[rgba(55,142,242,1)] bg-clip-text text-transparent">
//                 Alamat Toko
//             </div>

//             <div className="absolute w-[975px] h-[239px] top-[76px] left-0">
//                 {/* Map Display */}
//                 <div
//                     className="absolute w-[506px] h-[239px] top-0 left-0 overflow-hidden rounded-lg"
//                     style={{
//                         background: 'linear-gradient(45deg, #14a4ff, #4d53d2)', // your gradient colors
//                         padding: '0.4rem', // thickness of the border
//                         boxSizing: 'border-box',
//                     }}
//                 >
//                     <MapContainer
//                         center={position}
//                         zoom={15}
//                         style={{ height: '100%', width: '100%' }}
//                         scrollWheelZoom={false}
//                     >
//                         <TileLayer
//                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                             attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                         />
//                         <Marker position={position}>
//                             <Popup>Tirta Fresh</Popup>
//                         </Marker>
//                         <MapController />
//                     </MapContainer>
//                 </div>

//                 {/* Address Text */}
//                 <div className="absolute w-[441px] top-0.5 left-[532px] font-medium text-black text-2xl tracking-[0] leading-normal">
//                     Agen Galon Le Minerale Tirta Fresh
//                     <br />
//                     C749+QXF, Kalianyar, Jogoroto, Kec. Jogoroto, Kabupaten Jombang, Jawa Timur
//                 </div>

//                 {/* Maps Button - Updated with the specific URL */}
//                 <div className="absolute w-[267px] h-[62px] top-[177px] left-[532px]">
//                     <a
//                         href="https://maps.app.goo.gl/brgfhCbxETSRgAdUA"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                     >
//                         <div className="relative w-[265px] h-[62px] rounded-[20px] bg-gradient-to-r from-[rgba(77,84,210,1)] to-[rgba(55,142,242,1)] cursor-pointer hover:opacity-90 transition-opacity">
//                             <div className="absolute w-36 top-[7px] left-[61px] font-normal text-white text-[32px] text-center tracking-[0] leading-normal">
//                                 Maps
//                             </div>
//                         </div>
//                     </a>
//                 </div>
//             </div>
//         </div>
//     );
// }