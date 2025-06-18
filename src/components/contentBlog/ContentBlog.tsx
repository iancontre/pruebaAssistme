import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ContentBlog.css";
import { BsSearch } from "react-icons/bs";
import imageblogone from '../../assets/images/blog 1.png';
import imageblogtwo from '../../assets/images/blog 2.png';
import imageblogthree from '../../assets/images/blog3.png';
import imageblogfour from '../../assets/images/blog4.png';
import imageblogfive from '../../assets/images/blog 6.png';
import imageblogsix from '../../assets/images/blog5.png';

const posts = [
  {
    title: "Why Your Business Needs a Virtual Receptionist",
    date: "08-11-2021",
    category: "Category",
    description:
      "In today's fast-paced business world, every call and interaction with a potential client matters...",
    image: imageblogone,
    slug: "why-your-business-needs-virtual-receptionist",
  },
  {
    title: "How ASSIST-ME Can Help Real Estate Agents Boost Their Business",
    date: "08-11-2021",
    category: "Category",
    description:
      "Real estate is a highly competitive industry, and staying ahead means being available whenever your clients need you...",
    image: imageblogtwo,
    slug: "real-estate-agents-boost-business",
  },
];

const additionalPosts = [
  {
    title: "Why Every Accountant Needs a Virtual Assistant",
    image: imageblogthree,
    date: "08-11-2021",
    category: "Category",
    slug: "accountant-virtual-assistant",
  },
  {
    title: "The Hidden Costs of Missing Customer Calls & How to Avoid Them",
    image: imageblogfour,
    date: "08-11-2021",
    category: "Category",
    slug: "hidden-costs-missing-calls",
  },
  {
    title: "Why Your Business Needs a Virtual Receptionist",
    image: imageblogfive,
    date: "08-11-2021",
    category: "Category",
    slug: "virtual-receptionist-comparison",
  },
  {
    title: "How ASSIST-ME Can Help Real Estate Agents Boost Their Business",
    image: imageblogsix,
    date: "08-11-2021",
    category: "Category",
    slug: "real-estate-communication-strategies",
  },
];

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

const Blog: React.FC = () => {
  const navigate = useNavigate();

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
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
        Our Latest Blog Posts
      </motion.h1>
  
      {/* Buscador alineado con todo el contenido */}
      <motion.div 
        className="search-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={searchVariants}
      >
        <div className="search-container">
          <BsSearch className="search-icon" />
          <input type="text" placeholder="Search here...." className="search-bar" />
          <button className="search-button">Search</button>
        </div>
      </motion.div>
      {/* Layout con tarjetas grandes y pequeñas una al lado de la otra */}
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
                    See More
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
    
        {/* Tarjetas pequeñas al lado */}
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
      </motion.div>
  </div>
  
  );
};

export default Blog;
