import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./BlogPostDetail.css";

interface BlogPostDetailProps {
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
  author?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.2,
    },
  },
};

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  title,
  date,
  category,
  image,
  content,
  author = "ASSIST-ME Team"
}) => {
  const [isSharing, setIsSharing] = useState<string | null>(null);
  // Función para detectar si estamos en un dispositivo móvil
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Función para obtener la URL actual o una URL de producción
  const getCurrentUrl = () => {
    const currentUrl = window.location.href;
    // Si estamos en desarrollo, puedes usar una URL de producción temporal
    // Cambia esta URL por tu dominio de producción cuando lo tengas
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      return `https://assist-me.com${window.location.pathname}`;
    }
    return currentUrl;
  };

  // Función para limpiar el contenido HTML para la descripción
  const getCleanDescription = (htmlContent: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.substring(0, 150) + '...';
  };

  // Actualizar meta tags para mejores previsualizaciones en redes sociales
  useEffect(() => {
    const cleanDescription = getCleanDescription(content);
    const siteUrl = getCurrentUrl();
    
    // Actualizar título de la página
    document.title = `${title} | ASSIST-ME Blog`;
    
    // Función para actualizar o crear meta tags
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const attribute = isProperty ? 'property' : 'name';
      let metaTag = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute(attribute, property);
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', content);
    };

    // Meta tags básicos
    updateMetaTag('description', cleanDescription, false);
    updateMetaTag('keywords', `${category}, ASSIST-ME, blog, ${title}`, false);
    
    // Open Graph tags para Facebook
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', cleanDescription);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', siteUrl);
    updateMetaTag('og:type', 'article');
    updateMetaTag('og:site_name', 'ASSIST-ME');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', cleanDescription);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:site', '@AssistMe');
    
    // LinkedIn específico
    updateMetaTag('article:author', author);
    updateMetaTag('article:published_time', date);
    updateMetaTag('article:section', category);

    // Cleanup al desmontar
    return () => {
      document.title = 'ASSIST-ME';
    };
  }, [title, content, image, date, category, author]);

  // Función para intentar abrir app nativa con fallback a web
  const tryOpenApp = (appUrl: string, webUrl: string, platform: string) => {
    setIsSharing(platform);
    
    if (isMobileDevice()) {
      // Crear un enlace temporal para probar si la app se abre
      const appLink = document.createElement('a');
      appLink.href = appUrl;
      appLink.style.display = 'none';
      document.body.appendChild(appLink);
      
      // Configurar fallback después de un tiempo
      const timeout = setTimeout(() => {
        // Si después de 2 segundos no se abrió la app, abrir en navegador
        window.open(webUrl, '_blank');
        setIsSharing(null);
      }, 2000);
      
      // Intentar abrir la app
      try {
        appLink.click();
        // Si la app se abre exitosamente, cancelar el fallback
        window.addEventListener('blur', () => {
          clearTimeout(timeout);
          setIsSharing(null);
        }, { once: true });
        
        // También resetear si se enfoca la ventana después de un tiempo
        setTimeout(() => {
          setIsSharing(null);
        }, 3000);
      } catch (error) {
        // Si falla, ir directamente al navegador
        clearTimeout(timeout);
        window.open(webUrl, '_blank');
        setIsSharing(null);
      }
      
      // Limpiar el enlace temporal
      setTimeout(() => {
        if (document.body.contains(appLink)) {
          document.body.removeChild(appLink);
        }
      }, 3000);
    } else {
      // En desktop, abrir directamente en navegador con ventana emergente
      window.open(webUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      setIsSharing(null);
    }
  };

  // Funciones para compartir en redes sociales
  const shareOnFacebook = () => {
    const url = getCurrentUrl();
    const text = `${title}\n\n${getCleanDescription(content)}`;
    
    // Deep link para Facebook app
    const facebookAppUrl = `fb://facewebmodal/f?href=${encodeURIComponent(url)}`;
    
    // URL web como fallback
    const facebookWebUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    
    tryOpenApp(facebookAppUrl, facebookWebUrl, 'facebook');
  };

  const shareOnTwitter = () => {
    const url = getCurrentUrl();
    const text = `${title}\n\n${getCleanDescription(content)}`;
    const hashtags = `AssistMe,${category.replace(/\s+/g, '')}`;
    
    // Deep link para Twitter app
    const twitterAppUrl = `twitter://post?message=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    
    // URL web como fallback
    const twitterWebUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    
    tryOpenApp(twitterAppUrl, twitterWebUrl, 'twitter');
  };

  const shareOnLinkedIn = () => {
    const url = getCurrentUrl();
    const summary = `${title}\n\n${getCleanDescription(content)}`;
    
    // Deep link para LinkedIn app
    const linkedInAppUrl = `linkedin://shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    
    // URL web como fallback
    const linkedInWebUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    
    tryOpenApp(linkedInAppUrl, linkedInWebUrl, 'linkedin');
  };
  return (
    <motion.article 
      className="blog-post-detail"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
    <motion.div className="post-header" variants={fadeInUp}>
      <motion.div className="post-meta" variants={textReveal}>
        <span className="post-date">{date}</span>
        <span className="post-separator">|</span>
        <span className="post-category">{category}</span>
        {author && (
          <>
            <span className="post-separator">|</span>
            <span className="post-author">Por {author}</span>
          </>
        )}
      </motion.div>
      
      <motion.h1 className="post-title" variants={textReveal}>
        {title}
      </motion.h1>
    </motion.div>

    <motion.div className="post-image-container" variants={fadeInUp}>
      <img src={image} alt={title} className="post-featured-image" />
    </motion.div>

    <motion.div 
      className="post-content" 
      variants={textReveal}
      dangerouslySetInnerHTML={{ __html: content }}
    />

    <motion.div className="post-footer" variants={textReveal}>
      <div className="post-tags">
        <span className="tag">{category}</span>
      </div>
      
      <div className="post-share">
        <p>Comparte este artículo:</p>
        <div className="share-buttons">
          <button 
            className={`share-btn facebook ${isSharing === 'facebook' ? 'sharing' : ''}`} 
            onClick={shareOnFacebook} 
            title="Compartir en Facebook"
            disabled={isSharing === 'facebook'}
          >
            {isSharing === 'facebook' ? (
              <div className="loading-spinner">⚡</div>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
          </button>
          <button 
            className={`share-btn x ${isSharing === 'twitter' ? 'sharing' : ''}`} 
            onClick={shareOnTwitter} 
            title="Compartir en X (Twitter)"
            disabled={isSharing === 'twitter'}
          >
            {isSharing === 'twitter' ? (
              <div className="loading-spinner">⚡</div>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            )}
          </button>
          <button 
            className={`share-btn linkedin ${isSharing === 'linkedin' ? 'sharing' : ''}`} 
            onClick={shareOnLinkedIn} 
            title="Compartir en LinkedIn"
            disabled={isSharing === 'linkedin'}
          >
            {isSharing === 'linkedin' ? (
              <div className="loading-spinner">⚡</div>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="back-to-blog-section">
        <button className="back-to-blog-btn" onClick={() => window.history.back()}>
          <svg className="back-arrow-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Volver al Blog
        </button>
      </div>
    </motion.div>
  </motion.article>
  );
};

export default BlogPostDetail; 