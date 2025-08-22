// // src/pages/PropertyDetails.jsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import { BedDouble, Bath, Car, Trees } from "lucide-react";
// import properties from "../data/properties";

// export default function PropertyDetails() {
//   const { id } = useParams();
//   const property = properties.find((p) => p.id === Number(id));

//   if (!property) {
//     return (
//       <div className="pt-28 pb-10 max-w-5xl mx-auto">
//         Property not found.
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen pt-28 pb-10">
//       <div className="max-w-5xl mx-auto px-4 md:flex gap-8">
//         {/* Images */}
//         <div className="md:w-1/2">
//           <img
//             src={property.image}
//             alt={property.title}
//             className="w-full h-80 object-cover rounded-xl"
//           />
//           <div className="flex gap-4 mt-4">
//             <img
//               src={property.image}
//               alt=""
//               className="w-1/2 h-24 object-cover rounded-lg"
//             />
//             <img
//               src={property.image}
//               alt=""
//               className="w-1/2 h-24 object-cover rounded-lg"
//             />
//           </div>
//         </div>

//         {/* Content */}
//         <div className="md:w-1/2 mt-6 md:mt-0 space-y-6">
//           <h1 className="text-3xl font-semibold text-gray-800">
//             {property.title}
//           </h1>
//           <p className="text-gray-600">{property.location}</p>

//           {/* price → EH Verified → category */}
//           <div className="flex items-center gap-3">
//             <p className="text-2xl font-bold text-gray-900">
//               {property.price}
//             </p>
//             <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">
//               EH&nbsp;Verified&trade;
//             </span>
//             <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
//               {property.category}
//             </span>
//           </div>

//           {/* bed/bath/park icons */}
//           <div className="grid grid-cols-4 gap-6 text-center text-sm">
//             <div className="space-y-1">
//               <BedDouble className="mx-auto w-5 h-5 text-gray-700" />
//               <p className="font-medium">{property.beds} BHK</p>
//             </div>
//             <div className="space-y-1">
//               <Bath className="mx-auto w-5 h-5 text-gray-700" />
//               <p className="font-medium">{property.baths} Baths</p>
//             </div>
//             <div className="space-y-1">
//               <Car className="mx-auto w-5 h-5 text-gray-700" />
//               <p className="font-medium">{property.parking} Park</p>
//             </div>
//             <div className="space-y-1">
//               <Trees className="mx-auto w-5 h-5 text-gray-700" />
//               <p className="font-medium">Parks</p>
//             </div>
//           </div>

//           {/* features */}
//           <div className="mt-6">
//             <h2 className="text-lg font-semibold">Features</h2>
//             <ul className="grid grid-cols-2 list-disc list-inside text-gray-700 gap-x-6 mt-2">
//               <li>Private Terrace/Garden</li>
//               <li>Swimming Pool</li>
//               <li>Reserved Parking</li>
//               <li>Power Backup</li>
//             </ul>
//           </div>

//           <p className="text-gray-600 mt-6">
//             A luxurious villa in the upscale neighborhood of {property.location}.
//           </p>

//           {/* footer actions */}
//           <div className="mt-8 flex items-center justify-between">
//             <Link to="/properties" className="text-[#1F275E] hover:underline">
//               &larr; Back to Listings
//             </Link>
//             <button className="bg-[#1F275E] text-white font-medium px-5 py-2 rounded-lg shadow hover:bg-[#0f1646]">
//               View Details
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// // src/pages/PropertiesDetails.jsx
// import React from "react";
// import { useParams } from "react-router-dom";
// import properties from "../data/properties";

// const PropertyDetails = () => {
//   const { id } = useParams();
//   const property = properties.find(p => p.id === Number(id));

//   if (!property) return <p className="pt-24 text-center">Property not found.</p>;

//   const mapSrc =
//     property.map
//       ? `https://www.google.com/maps?q=${property.map.lat},${property.map.lng}&z=15&output=embed`
//       : `https://www.google.com/maps?q=${encodeURIComponent(property.location)}&z=15&output=embed`;

//   return (
//     <div className="max-w-6xl mx-auto pt-24 pb-10 px-4">
//       {/* Gallery + Info */}
//       <div className="grid md:grid-cols-2 gap-8">
//         <div>
//           <img
//             src={property.images[0]}
//             alt={property.title}
//             className="w-full h-80 object-cover rounded-2xl mb-3"
//           />
//           <div className="flex gap-4">
//             {property.images.slice(1, 4).map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 alt={`${property.title}-${i}`}
//                 className="w-24 h-24 object-cover rounded-xl"
//               />
//             ))}
//           </div>
//         </div>

//         <div>
//           <h1 className="text-3xl font-semibold mb-1">{property.title}</h1>
//           <p className="text-gray-500 mb-4">{property.location}</p>
//           <p className="text-2xl font-bold text-green-600 mb-6">{property.price}</p>

//           <div className="flex gap-8 mb-6 text-center">
//             <div>
//               <p className="text-xl font-semibold">{property.bhk}</p>
//               <p className="text-gray-500">BHK</p>
//             </div>
//             <div>
//               <p className="text-xl font-semibold">{property.baths}</p>
//               <p className="text-gray-500">Baths</p>
//             </div>
//             <div>
//               <p className="text-xl font-semibold">{property.parking}</p>
//               <p className="text-gray-500">Prk</p>
//             </div>
//           </div>

//           {property.features?.length > 0 && (
//             <>
//               <h2 className="text-xl font-semibold mb-2">Features</h2>
//               <ul className="flex flex-wrap gap-2 mb-6">
//                 {property.features.map(f => (
//                   <li key={f} className="bg-gray-100 px-4 py-1 rounded-full text-sm">
//                     {f}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}

//           <p className="text-gray-700">{property.description}</p>
//         </div>
//       </div>

//       {/* Map */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-semibold mb-4">Location</h2>
//         <div className="w-full h-80 rounded-2xl overflow-hidden">
//           <iframe
//             title="google-map"
//             src={mapSrc}
//             width="100%"
//             height="100%"
//             style={{ border: 0 }}
//             loading="lazy"
//             allowFullScreen
//             referrerPolicy="no-referrer-when-downgrade"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyDetails;


// src/pages/PropertiesDetails.jsx
// src/pages/PropertyDetails.jsx
import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import properties from "../data/properties";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function PropertyDetails() {
  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));

  const mapContainer = useRef(null);
  const mapSectionRef = useRef(null);

  useEffect(() => {
    if (!property?.map) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [property.map.lng, property.map.lat],
      zoom: 13,
    });

    // --- MODIFICATION START ---
    map.scrollZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disable();

    const popupContent = document.createElement("div");
    popupContent.className = "p-2";
    const button = document.createElement("button");
    button.className =
      "bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-700";
    button.innerText = "Open in Google Maps";
    button.onclick = () => {
      const url = `https://www.google.com/maps?q=${property.map.lat},${property.map.lng}`;
      window.open(url, "_blank");
    };
    popupContent.appendChild(button);

    const popup = new mapboxgl.Popup({ offset: 40 }).setDOMContent(
      popupContent
    );

    const markerEl = document.createElement("div");
    markerEl.innerHTML = `
      <svg viewBox="0 0 24 24" width="32" height="32" fill="#ff0000" style="cursor: pointer;">
        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
      </svg>
    `;

    new mapboxgl.Marker({ element: markerEl, anchor: "bottom" })
      .setLngLat([property.map.lng, property.map.lat])
      .setPopup(popup)
      .addTo(map);
    // --- MODIFICATION END ---

    return () => map.remove();
  }, [property]);

  if (!property)
    return <p className="pt-24 text-center">Property not found.</p>;

  // updated image gallery logic
  const gallery =
    Array.isArray(property?.image_gallery) && property.image_gallery.length
      ? property.image_gallery
      : property.image
      ? [property.image]
      : [];

  const mainImage = gallery[0] || "";
  let thumbs = gallery.slice(1, 3);
  while (thumbs.length < 2) thumbs.push(mainImage);

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-10">
      <div className="max-w-5xl mx-auto px-4 md:flex gap-8">
        {/* Images */}
        <div className="md:w-1/2">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-80 object-cover rounded-xl"
          />
          {mainImage && (
            <div className="flex gap-4 mt-4">
              {thumbs.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${property.title}-${i + 1}`}
                  className="w-1/2 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Content (No changes here) */}
        <div className="md:w-1/2 mt-6 md:mt-0 space-y-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            {property.title}
          </h1>
          <p className="text-gray-600">{property.location}</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-gray-900">
              {property.price}
            </p>
            <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              EH Verified™
            </span>
            <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
              {property.category}
            </span>
          </div>
          <div className="flex gap-8 mb-6 text-center">
            <div>
              <p className="text-xl font-semibold">{property.bhk}</p>
              <p className="text-gray-500">BHK</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{property.baths}</p>
              <p className="text-gray-500">Baths</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{property.parking}</p>
              <p className="text-gray-500">Prk</p>
            </div>
          </div>
          {property.features?.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Features</h2>
              <ul className="flex flex-wrap gap-2 mb-6">
                {property.features.map((f) => (
                  <li
                    key={f}
                    className="bg-gray-100 px-4 py-1 rounded-full text-sm"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="text-gray-700">{property.description}</p>
          <div className="mt-8 flex items-center justify-between">
            <Link to="/properties" className="text-[#1F275E] hover:underline">
              ← Back to Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Mapbox map */}
      <div ref={mapSectionRef} className="max-w-5xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <div
          ref={mapContainer}
          className="w-full h-80 rounded-xl overflow-hidden"
        />
      </div>
    </div>
  );
}