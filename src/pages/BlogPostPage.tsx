import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import Nav from '../components/nav/Nav';
import BlogPostDetail from '../components/blogPostDetail/BlogPostDetail';
import Footer from '../components/footer/Footer';
import { getPostBySlug } from '../data/blogPosts';
import ZendeskWidget from '../components/ZendeskWidget/ZendeskWidget';

const fadeInUp = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Buscar el post por slug
  const post = slug ? getPostBySlug(slug) : null;
  
  // Si no existe el post, redirigir al blog
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <Nav />
      
      <Container maxWidth={false} sx={{ mt: '120px', mb: 4, px: 0 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <BlogPostDetail
            title={post.title}
            date={post.date}
            category={post.category}
            image={post.image}
            content={post.content}
            author={post.author}
          />
        </motion.div>
      </Container>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-150px' }}
        variants={fadeInUp}
      >
        <Footer />
      </motion.div>

      <ZendeskWidget />
    </>
  );
};

export default BlogPostPage; 