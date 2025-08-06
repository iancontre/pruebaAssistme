import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from '../../hooks/useTranslation';

import "./ContentBlog.css";
import { BsSearch } from "react-icons/bs";
import imageblogone from '../../assets/images/blog 1.png';
import imageblogtwo from '../../assets/images/blog 2.png';
import imageblogthree from '../../assets/images/blog3.png';
import imageblogfour from '../../assets/images/blog4.png';
import imageblogfive from '../../assets/images/blog 6.png';
import imageblogsix from '../../assets/images/blog5.png';

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const allPosts = [
    {
      title: t('contentBlog.posts.post1.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post1.description'),
      image: imageblogone,
      slug: "why-your-business-needs-virtual-receptionist",
    },
    {
      title: t('contentBlog.posts.post2.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post2.description'),
      image: imageblogtwo,
      slug: "real-estate-agents-boost-business",
    },
    {
      title: t('contentBlog.posts.post3.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post3.description'),
      image: imageblogthree,
      slug: "accountant-virtual-assistant",
    },
    {
      title: t('contentBlog.posts.post4.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post4.description'),
      image: imageblogfour,
      slug: "hidden-costs-missing-calls",
    },
    {
      title: t('contentBlog.posts.post1.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post1.description'),
      image: imageblogfive,
      slug: "virtual-receptionist-comparison",
    },
    {
      title: t('contentBlog.posts.post2.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post2.description'),
      image: imageblogsix,
      slug: "real-estate-communication-strategies",
    },
  ];

  // Filtrar posts basado en el término de búsqueda
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return allPosts;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.description.toLowerCase().includes(searchLower) ||
      post.category.toLowerCase().includes(searchLower)
    );
  }, [allPosts, searchTerm]);

  // Separar posts filtrados en featured y additional
  const posts = filteredPosts.slice(0, 2);
  const additionalPosts = filteredPosts.slice(2);

  // Variantes de animación
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const smallCardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda se realiza automáticamente con el filtrado
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="blog-container">
      <motion.h1 
        className="title"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={titleVariants}
      >
        {t('contentBlog.title')}
      </motion.h1>
  
      {/* Buscador alineado con todo el contenido */}
      <motion.div 
        className="search-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={searchVariants}
      >
        <form onSubmit={handleSearch} className="search-container">
          <BsSearch className="search-icon" />
          <input 
            type="text" 
            placeholder={t('contentBlog.search.placeholder')} 
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button type="submit" className="search-button">
            {t('contentBlog.search.button')}
          </button>
        </form>
      </motion.div>

      {/* Mostrar mensaje si no hay resultados */}
      {filteredPosts.length === 0 && searchTerm.trim() && (
        <motion.div 
          className="no-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#666',
            fontSize: '1.1rem'
          }}
        >
          {t('contentBlog.noResults')} "{searchTerm}"
        </motion.div>
      )}

      {/* Layout con tarjetas grandes y pequeñas una al lado de la otra */}
      {filteredPosts.length > 0 && (
        <motion.div 
          className="blog-content-layout"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Tarjetas grandes */}
          <motion.div 
            className="featured-posts"
            variants={containerVariants}
          >
            {posts.map((post, index) => (
              <motion.div 
                key={index} 
                className="post-card"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02, 
                  transition: { duration: 0.3 } 
                }}
              >
                <img src={post.image} alt={post.title} className="post-image" />
                <div className="post-content">
                  <p className="post-meta">{post.date} <span>|</span> {post.category}</p>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-description">{post.description}</p>
                  <div className="container-btn">
                    <motion.button 
                      className="see-more"
                      onClick={() => handlePostClick(post.slug)}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('contentBlog.seeMore')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
      
          {/* Tarjetas pequeñas al lado */}
          {additionalPosts.length > 0 && (
            <motion.div 
              className="additional-posts"
              variants={containerVariants}
            >
              {additionalPosts.map((post, index) => (
                <motion.div 
                  key={index} 
                  className="additional-post"
                  variants={smallCardVariants}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  onClick={() => handlePostClick(post.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={post.image} alt={post.title} className="thumb" />
                  <div className="additional-post-content">
                    <p className="post-meta">{post.date} <span>|</span> {post.category}</p>
                    <p className="post-title">{post.title}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
  </div>
  
  );
};

export default Blog;
