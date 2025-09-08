import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

export const categories = ['All', 'Market Analysis', 'Technology', 'Legal', 'Investment', 'Design', 'Trends'];

export const blogPosts = [
  {
    title: 'The Rise of Co-living Spaces in Indian Cities',
    description: 'Analyzing the growing trend of co-living spaces and their impact on rental markets in major Indian cities.',
    image: 'https://images.pexels.com/photos/10417137/pexels-photo-10417137.jpeg',
    date: '15/02/2024',
    tag: 'Trends',
    slug: 'rise-of-co-living-spaces-indian-cities',
  },
  {
    title: 'Complete Guide to Property Documentation',
    description: 'Everything you need to know about property documentation, legal compliance, and verification processes in India.',
    image: 'https://images.pexels.com/photos/2859169/pexels-photo-2859169.jpeg',
    date: '05/03/2024',
    tag: 'Legal',
    slug: 'complete-guide-property-documentation',
  },
  {
    title: 'Real Estate Market Trends in Bangalore 2024',
    description: "Deep dive into the latest market trends, price movements, and investment opportunities in Bangalore's real estate sector.",
    image: 'https://images.pexels.com/photos/27745581/pexels-photo-27745581.jpeg',
    date: '05/03/2024',
    tag: 'Market Analysis',
    slug: 'real-estate-market-trends-bangalore-2024',
  },
  {
    title: 'AI in Real Estate: The Future of Property Search',
    description: 'Explore how artificial intelligence is revolutionizing property search, valuation, and investment strategies.',
    image: 'https://images.pexels.com/photos/5926391/pexels-photo-5926391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '20/03/2024',
    tag: 'Technology',
    slug: 'ai-in-real-estate-future-of-property-search',
  },
  {
    title: 'Investment Hotspots: Top Localities for Property Investment',
    description: 'Discover the most promising localities for real estate investment with high ROI potential.',
    image: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '10/04/2024',
    tag: 'Investment',
    slug: 'investment-hotspots-top-localities-real-estate',
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const swiperRef = useRef(null);

  const filteredBlogPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.tag === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center text-center px-6 py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 max-w-3xl mx-auto text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">Learn & Grow</h1>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed mb-10">
            Stay informed with the latest insights, trends, and expert advice in real estate.
            From market analysis to investment strategies, we've got you covered.
          </p>
          <div className="w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-6 py-3 bg-white rounded-full text-black text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Category + Blog Carousel Section */}
      <section className="relative px-4 py-12 max-w-7xl mx-auto">
        {/* Category Tabs */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap bg-blue-100 px-3 py-2 rounded-full mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-2 rounded-full font-medium transition ${
                activeCategory === cat
                  ? 'text-red-600 font-bold bg-white shadow-sm'
                  : 'text-gray-700 hover:text-red-500 hover:bg-blue-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-blog',
              prevEl: '.swiper-button-prev-blog',
            }}
            onReachEnd={() => {
              const idx = categories.indexOf(activeCategory);
              const next = (idx + 1) % categories.length;
              setActiveCategory(categories[next]);
              setTimeout(() => { if (swiperRef.current) swiperRef.current.slideTo(0, 0); }, 0);
            }}
            onReachBeginning={() => {
              const idx = categories.indexOf(activeCategory);
              const prev = (idx - 1 + categories.length) % categories.length;
              setActiveCategory(categories[prev]);
              setTimeout(() => { if (swiperRef.current) swiperRef.current.slideTo(0, 0); }, 0);
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-0"
          >
            {filteredBlogPosts.map((post, idx) => (
              <SwiperSlide key={idx}>
                <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl hover:scale-[1.02] duration-300 ease-in-out h-full min-h-[440px] w-full flex items-stretch ${idx % 2 === 0 ? 'flex-col' : 'flex-col-reverse'}`}>
                  {/* Image Block */}
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 md:h-52 object-cover"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/400x250/E0E0E0/333333?text=Image+Error'; }}
                    />
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      {post.tag}
                    </span>
                  </div>
                  {/* Text Block */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                      <span className="flex items-center gap-1 font-medium">
                        <FaStar className="text-yellow-500" size={14} />
                        {post.date}
                      </span>
                      <Link to={`/blog/${post.slug}`} className="text-red-600 text-base font-semibold hover:text-red-700 transition whitespace-nowrap">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            className="swiper-button-prev-blog absolute -left-2 sm:-left-4 md:-left-6 lg:-left-8 xl:-left-10 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-[#040449] transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Previous blog post"
          >
            <FaChevronLeft size={18} />
          </button>
          <button
            className="swiper-button-next-blog absolute -right-2 sm:-right-4 md:-right-6 lg:-right-8 xl:-right-10 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-[#040449] transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Next blog post"
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </section>
    </>
  );
};

export default Blog;
