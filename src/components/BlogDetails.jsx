import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from './Blog';

const slugify = (s = '') => s.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = React.useMemo(() => {
    return (
      blogPosts.find(p => p.slug === slug) ||
      blogPosts.find(p => slugify(p.title) === slug) ||
      null
    );
  }, [slug]);

  if (!post) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <button onClick={() => navigate('/blog')} className="text-red-600 font-semibold hover:underline">Back to Blog</button>
      </section>
    );
  }

  const related = blogPosts
    .filter(p => p.title !== post.title && (p.tag === post.tag || p.slug !== post.slug))
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section
        className="relative h-[40vh] md:h-[48vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-5xl mx-auto px-4 pb-6 text-white">
            <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full mb-3">{post.tag}</span>
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">{post.title}</h1>
            <p className="mt-2 text-sm opacity-90">{post.date}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            <p className="text-gray-700 leading-relaxed mb-4">{post.description}</p>
            <p className="text-gray-700 leading-relaxed mb-4">
              In this in-depth article, we explore key factors shaping this topic, including market dynamics, regulatory frameworks, and technology-driven transformation. Our analysis brings together expert insights and practical guidance to help you make informed decisions.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you are a first-time reader or a seasoned investor, this guide outlines actionable takeaways and trends to watch. Save or share this article to revisit as the market evolves.
            </p>

            {post.videoUrl && (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow">
                <iframe
                  src={post.videoUrl}
                  title={post.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </article>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold mb-4">Related News</h3>
              <div className="space-y-4">
                {related.map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="flex gap-3 group">
                    <img src={p.image} alt={p.title} className="w-24 h-16 object-cover rounded-md" />
                    <div>
                      <div className="text-xs text-red-600 font-semibold">{p.tag}</div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:underline line-clamp-2">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.date}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;

