// const images = [
//   "https://estatehive.in/h02@300x-100.jpg",
//   "https://estatehive.in/h04@300x-100.jpg",
//   "https://estatehive.in/h11@300x-100.jpg",
//   "https://estatehive.in/h05@300x-100.jpg",
//   "/h03@300x-100.jpg.png",
//   "https://estatehive.in/h01@300x-100.jpg",
// ];

// const data = [
//   { name: "Konig Villas North County", type: "4 Bhk Villas", location: "Devanahalli", price: "2.46 - 3.21 Cr", phone: "8971492601", category: "For Sale" },
//   { name: "Barca At Godrej MSR City", type: "2/3 Bhk Apartment", location: "Devanahalli", price: "1.3 - 1.89 Cr", phone: "", category: "For Sale" },
//   { name: "Hybenden Clifton", type: "2/3 Bhk", location: "Devanahalli", price: "93.07 L - 1.64 Cr", phone: "", category: "For Sale" },
//   { name: "Ebony at Brigade Orchards", type: "3/4 Bhk", location: "Devanahalli", price: "1.55 - 2.22 Cr", phone: "", category: "For Sale" },
//   { name: "Provident Deansgate", type: "3 BHK", location: "Devanahall/IVC Road", price: "2.09 - 2.42 Cr", phone: "", category: "For Sale" },
//   { name: "Birla Trimaya Phase 3", type: "2/3/4 BHK", location: "Devanahalli", price: "1.12 - 3.16 Cr", phone: "", category: "For Sale" },
//   { name: "Arvind The Park", type: "Plot", location: "Devanahalli", price: "80.65 L - 1.32 Cr", phone: "", category: "For Sale" },
//   { name: "Earthsong by Manyata", type: "Plot", location: "Devanahalli", price: "40 L - 6.33 Cr", phone: "", category: "For Sale" },
//   { name: "The Secret Lake", type: "Plot", location: "Devanahalli", price: "72 L - 1.92 Cr", phone: "", category: "For Sale" },
//   { name: "Vagmine Water Homes", type: "4 BHK", location: "Devanahalli", price: "4.5 Cr", phone: "", category: "For Sale" },
//   { name: "Brigade Oasis", type: "", location: "Devanahalli", price: "90 L - 1.8 Cr", phone: "", category: "For Sale" },
//   { name: "Mersuri Antelopes", type: "4 BHK", location: "Devanahalli", price: "3.98 - 4.34 Cr", phone: "", category: "For Sale" },

//   { name: "Century Trails", type: "Land", location: "Devanahalli", price: "86 L - 1.72 Cr", phone: "", category: "For Rent" },
//   { name: "Signature One", type: "4 BHK", location: "Devanahalli", price: "2.87 - 3.41 Cr", phone: "", category: "For Rent" },
//   { name: "Brigade Atmosphere", type: "3/4 BHK", location: "Devanahalli", price: "1.02 - 4 Cr", phone: "", category: "For Rent" },
//   { name: "Total Environment", type: "Land", location: "Devanahalli", price: "1.56 - 6.25 Cr", phone: "", category: "For Rent" },
//   { name: "Assetz Zen and Sato", type: "3/4 BHK", location: "Yelahanka", price: "2.70 Cr - 3.69 Cr", phone: "Aditi 9148032840 / Akhil 8792494788", category: "For Rent" },
//   { name: "Brigade Eternia", type: "1/3/4 BHK", location: "Yelahanka", price: "1.01 Cr - 4.62 Cr", phone: "", category: "For Rent" },
//   { name: "Lodha Mirabelle", type: "2/3/4 BHK", location: "Hebbal", price: "1.49 Cr - 5.43 Cr", phone: "", category: "For Rent" },
//   { name: "SB Urban Park", type: "3/4 BHK", location: "Thanisandra", price: "1.77 - 3.38 Cr", phone: "", category: "For Rent" },
//   { name: "Sumadhura Epitome", type: "2/3/4 BHK", location: "Hebbal", price: "1.46 - 2.39 Cr", phone: "", category: "For Rent" },
//   { name: "Montira by Rare earth", type: "Land", location: "Nandi Hills, Chikkaballapur", price: "70 L - 1.87 Cr", phone: "", category: "For Rent" },
//   { name: "Keya Life by the Lake", type: "4/5 BHK", location: "Hebbal", price: "3.66 Cr - 4.18 Cr", phone: "", category: "For Rent" },
//   { name: "L&T Elara Celestia", type: "3/4 BHK", location: "Yelahanka", price: "2.9 Cr - 5.62 Cr", phone: "", category: "For Rent" },

//   { name: "Concorde Mayfair", type: "3 BHK", location: "Yelahanka", price: "2.2 - 2.52 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "Casagrand Promenade", type: "2/3/4 BHK", location: "Yelahanka", price: "1 L - 2 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "Sobha Hamptons", type: "3/4 BHK", location: "Attibelle", price: "1.57 - 2.45 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "Total Environment - In That quiet earth", type: "2/3/4 BHK", location: "Hennur Road", price: "2.05 Cr - 6.05 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "Alpine Pyramid", type: "2/3/4 BHK", location: "Sahakara Nagar", price: "1.15 Cr - 2.23 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "RG Orchids Gardenia", type: "3 BHK", location: "Hebbal", price: "2.99 - 4.05 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "L&T Olivia", type: "3/4 BHK", location: "Hebbal", price: "2.75 - 3.88 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "TVS Isle of Trees", type: "3/4 BHK", location: "Hebbal", price: "1.83 - 2.89 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "Sobha HRC Pristine", type: "3/4 BHK", location: "Jakkur", price: "2.98 - 7 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "Ranka Ankura", type: "2/3/4 BHK", location: "Thanisandra", price: "1.2 Cr - 2 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "Prestige Camden Gardens", type: "3/4 BHK", location: "Thanisandra", price: "2.28 Cr - 3.82 Cr", phone: "", category: "Luxury Rentals" },
//   { name: "Vajram Vivera", type: "3/4 BHK", location: "Thanisandra", price: "1.81 Cr - 2.89 Cr", phone: "", category: "Luxury Rentals" },

//   { name: "Total Down by the water", type: "3/4 BHK", location: "Yelahanka", price: "4.49 - 11.75 Cr", phone: "", category: "EH Signature™" },
//   { name: "Surya Valencia", type: "4/5 BHK", location: "Yelahanka", price: "3.33 - 3.79 Cr", phone: "", category: "EH Signature™" },
//   { name: "Elegant Takt Tropical Symphony", type: "2/3/4 BHK", location: "Yelahanka", price: "1.3 Cr - 2.6 Cr", phone: "", category: "EH Signature™" },
//   { name: "Visista By Vista Spaces Okas", type: "2/3 BHK", location: "Yelahanka", price: "3.81 Cr", phone: "", category: "EH Signature™" },
//   { name: "Assetz Sora and Saki", type: "3/4 BHK", location: "Bagalur", price: "1.94 Cr - 2.5 Cr", phone: "", category: "EH Signature™" },
//   { name: "Brigade El Dorado", type: "2/3/4 BHK", location: "Bagalur", price: "67 L - 2.03 Cr", phone: "", category: "EH Signature™" },
//   { name: "Godrej Ananda", type: "2/3 BHK", location: "Bagalur", price: "1.14 - 1.92 Cr", phone: "", category: "EH Signature™" },
//   { name: "DNR Parklink", type: "2/3/4 BHK", location: "Hennur Road", price: "1.32 - 2.42 Cr", phone: "", category: "EH Signature™" },
//   { name: "Kolte Patil Lakeside", type: "2/3/4 BHK", location: "Hennur Road", price: "97.77 L - 2.46 Cr", phone: "", category: "EH Signature™" },
//   { name: "Living Walls Hush Fields", type: "Plots", location: "Hennur Road", price: "3.6 Cr", phone: "", category: "EH Signature™" },
//   { name: "Living Walls True North", type: "3/4 BHK", location: "Hennur Road", price: "2.11 Cr", phone: "", category: "EH Signature™" },
//   { name: "Mantri Webcity", type: "3 BHK", location: "Hennur Main Road", price: "1.85 Cr", phone: "", category: "EH Signature™" },
// ];

// export default data.map((p, i) => ({ ...p, image: images[i % images.length] }));




const properties = [
  {
    id: 1,
    title: "Konig Villas North County",
    type: "4 Bhk Villas",
    location: "Devanahalli",
    price: "2.46 - 3.21 Cr",
    phone: "8971492601",
    category: "For Sale",
    image: "/images/properties/Konig Villas North County.jpg"
  },
  {
    id: 2,
    title: "Barca At Godrej MSR City",
    type: "2/3 Bhk Apartment",
    location: "Devanahalli",
    price: "1.3 - 1.89 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Barca At Godrej MSR City.jpg"
  },
  {
    id: 3,
    title: "Hybenden Clifton",
    type: "2/3 Bhk",
    location: "Devanahalli",
    price: "93.07 L - 1.64 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Hybenden Clifton.jpg"
  },
  {
    id: 4,
    title: "Ebony at Brigade Orchards",
    type: "3/4 Bhk",
    location: "Devanahalli",
    price: "1.55 - 2.22 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Ebony at Brigade Orchards.jpg"
  },
  {
    id: 5,
    title: "Provident Deansgate",
    type: "3 BHK",
    location: "Devanahall/IVC Road",
    price: "2.09 - 2.42 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Provident Deansgate.jpg"
  },
  {
    id: 6,
    title: "Birla Trimaya Phase 3",
    type: "2/3/4 BHK",
    location: "Devanahalli",
    price: "1.12 - 3.16 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Birla Trimaya Phase 3.jpg"
  },
  {
    id: 7,
    title: "Arvind The Park",
    type: "Plot",
    location: "Devanahalli",
    price: "80.65 L - 1.32 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Arvind The Park.jpg"
  },
  {
    id: 8,
    title: "Earthsong by Manyata",
    type: "Plot",
    location: "Devanahalli",
    price: "40 L - 6.33 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Earthsong by Manyata.jpg"
  },
  {
    id: 9,
    title: "The Secret Lake",
    type: "Plot",
    location: "Devanahalli",
    price: "72 L - 1.92 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/The Secret Lake.jpg"
  },
  {
    id: 10,
    title: "Vagmine Water Homes",
    type: "4 BHK",
    location: "Devanahalli",
    price: "4.5 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Vagmine Water Homes.jpg"
  },
  {
    id: 11,
    title: "Brigade Oasis",
    type: "",
    location: "Devanahalli",
    price: "90 L - 1.8 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Brigade Oasis.jpg"
  },
  {
    id: 12,
    title: "Mersuri Antelopes",
    type: "4 BHK",
    location: "Devanahalli",
    price: "3.98 - 4.34 Cr",
    phone: "",
    category: "For Sale",
    image: "/images/properties/Mersuri Antelopes.jpg"
  },

  // For Rent (13-24)
  {
    id: 13,
    title: "Century Trails",
    type: "Land",
    location: "Devanahalli",
    price: "86 L - 1.72 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/Century Trails.jpg"
  },
  {
    id: 14,
    title: "Signature One",
    type: "4 BHK",
    location: "Devanahalli",
    price: "2.87 - 3.41 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/Signature One.jpg"
  },
  {
    id: 15,
    title: "Brigade Atmosphere",
    type: "3/4 BHK",
    location: "Devanahalli",
    price: "1.02 - 4 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/Brigade Atmosphere.jpg"
  },
  {
    id: 16,
    title: "Total Environment",
    type: "Land",
    location: "Devanahalli",
    price: "1.56 - 6.25 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/Total Environment.jpg"
  },
  {
    id: 17,
    title: "Assetz Zen and Sato",
    type: "3/4 BHK",
    location: "Yelahanka",
    price: "2.70 Cr - 3.69 Cr",
    phone: "Aditi 9148032840 / Akhil 8792494788",
    category: "For Rent",
    image: "/images/properties/Assetz Zen and Sato1.jpg"
  },
  {
    id: 18,
    title: "Brigade Eternia",
    type: "1/3/4 BHK",
    location: "Yelahanka",
    price: "1.01 Cr - 4.62 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/Brigade Eternia1.jpg"
  },
  {
    id: 19,
    title: "Lodha Mirabelle",
    type: "2/3/4 BHK",
    location: "Hebbal",
    price: "1.49 Cr - 5.43 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/LodhaMirabelle1.jpg"
  },
  {
    id: 20,
    title: "SB Urban Park",
    type: "3/4 BHK",
    location: "Thanisandra",
    price: "1.77 - 3.38 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/SB Urban Park.jpg"
  },
  {
    id: 21,
    title: "Sumadhura Epitome",
    type: "2/3/4 BHK",
    location: "Hebbal",
    price: "1.46 - 2.39 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/Sumadhura Epitome.jpg"
  },
  {
    id: 22,
    title: "Montira by Rare earth",
    type: "Land",
    location: "Nandi Hills, Chikkaballapur",
    price: "70 L - 1.87 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/Montira by Rare earth.jpg"
  },
  {
    id: 23,
    title: "Keya Life by the Lake",
    type: "4/5 BHK",
    location: "Hebbal",
    price: "3.66 Cr - 4.18 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/Keya Life by the Lake.jpg"
  },
  {
    id: 24,
    title: "L&T Elara Celestia",
    type: "3/4 BHK",
    location: "Yelahanka",
    price: "2.9 Cr - 5.62 Cr",
    phone: "",
    category: "For Rent",
    image: "/images/properties/L&T Elara Celestia.jpg"
  },
  // Continue from previous entries (starting from id: 25)
{
    id: 25,
    title: "Concorde Mayfair",
    type: "3 BHK",
    location: "Yelahanka",
    price: "2.2 - 2.52 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Concorde Mayfair.jpg"
  },
  {
    id: 26,
    title: "Casagrand Promenade",
    type: "2/3/4 BHK",
    location: "Yelahanka",
    price: "1 L - 2 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Casagrand Promenade.jpg"
  },
  {
    id: 27,
    title: "Sobha Hamptons",
    type: "3/4 BHK",
    location: "Attibelle",
    price: "1.57 - 2.45 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Sobha Hamptons.jpg"
  },
  {
    id: 28,
    title: "Total Environment - In That quiet earth",
    type: "2/3/4 BHK",
    location: "Hennur Road",
    price: "2.05 Cr - 6.05 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Total Environment - In That quiet earth.jpg"
  },
  {
    id: 29,
    title: "Alpine Pyramid",
    type: "2/3/4 BHK",
    location: "Sahakara Nagar",
    price: "1.15 Cr - 2.23 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Alpine Pyramid.jpg"
  },
  {
    id: 30,
    title: "RG Orchids Gardenia",
    type: "3 BHK",
    location: "Hebbal",
    price: "2.99 - 4.05 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/RG Orchids Gardenia.jpg"
  },
  {
    id: 31,
    title: "L&T Olivia",
    type: "3/4 BHK",
    location: "Hebbal",
    price: "2.75 - 3.88 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/L&T Olivia.jpg"
  },
  {
    id: 32,
    title: "TVS Isle of Trees",
    type: "3/4 BHK",
    location: "Hebbal",
    price: "1.83 - 2.89 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/TVS Isle of Trees.jpg"
  },
  {
    id: 33,
    title: "Sobha HRC Pristine",
    type: "3/4 BHK",
    location: "Jakkur",
    price: "2.98 - 7 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Sobha HRC Pristine.jpg"
  },
  {
    id: 34,
    title: "Ranka Ankura",
    type: "2/3/4 BHK",
    location: "Thanisandra",
    price: "1.2 Cr - 2 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Ranka Ankura.jpg"
  },
  {
    id: 35,
    title: "Prestige Camden Gardens",
    type: "3/4 BHK",
    location: "Thanisandra",
    price: "2.28 Cr - 3.82 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Prestige Camden Gardens.jpg"
  },
  {
    id: 36,
    title: "Vajram Vivera",
    type: "3/4 BHK",
    location: "Thanisandra",
    price: "1.81 Cr - 2.89 Cr",
    phone: "",
    category: "Luxury Rentals",
    image: "/images/properties/Vajram Vivera.jpg"
  },

  // EH Signature™ (37-48)
  {
    id: 37,
    title: "Total Down by the water",
    type: "3/4 BHK",
    location: "Yelahanka",
    price: "4.49 - 11.75 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Total Down by the water.jpg"
  },
  {
    id: 38,
    title: "Surya Valencia",
    type: "4/5 BHK",
    location: "Yelahanka",
    price: "3.33 - 3.79 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Surya Valencia.jpg"
  },
  {
    id: 39,
    title: "Elegant Takt Tropical Symphony",
    type: "2/3/4 BHK",
    location: "Yelahanka",
    price: "1.3 Cr - 2.6 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Elegant Takt Tropical Symphony.jpg"
  },
  {
    id: 40,
    title: "Visista By Vista Spaces Okas",
    type: "2/3 BHK",
    location: "Yelahanka",
    price: "3.81 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Visista By Vista Spaces Okas.jpg"
  },
  {
    id: 41,
    title: "Assetz Sora and Saki",
    type: "3/4 BHK",
    location: "Bagalur",
    price: "1.94 Cr - 2.5 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Assetz Sora and Saki.jpg"
  },
  {
    id: 42,
    title: "Brigade El Dorado",
    type: "2/3/4 BHK",
    location: "Bagalur",
    price: "67 L - 2.03 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Brigade El Dorado.jpg"
  },
  {
    id: 43,
    title: "Godrej Ananda",
    type: "2/3 BHK",
    location: "Bagalur",
    price: "1.14 - 1.92 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Godrej Ananda.jpg"
  },
  {
    id: 44,
    title: "DNR Parklink",
    type: "2/3/4 BHK",
    location: "Hennur Road",
    price: "1.32 - 2.42 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/DNR Parklink.jpg"
  },
  {
    id: 45,
    title: "Kolte Patil Lakeside",
    type: "2/3/4 BHK",
    location: "Hennur Road",
    price: "97.77 L - 2.46 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Kolte Patil Lakeside.jpg"
  },
  {
    id: 46,
    title: "Living Walls Hush Fields",
    type: "Plots",
    location: "Hennur Road",
    price: "3.6 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Living Walls Hush Fields.jpg"
  },
  {
    id: 47,
    title: "Living Walls True North",
    type: "3/4 BHK",
    location: "Hennur Road",
    price: "2.11 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Living Walls True North.jpg"
  },
  {
    id: 48,
    title: "Mantri Webcity",
    type: "3 BHK",
    location: "Hennur Main Road",
    price: "1.85 Cr",
    phone: "",
    category: "EH Signature™",
    image: "/images/properties/Mantri Webcity.jpg"
  }
];

export default properties;