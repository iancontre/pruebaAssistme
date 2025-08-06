import { useTranslation } from '../hooks/useTranslation';
import imageblogone from '../assets/images/blog 1.png';
import imageblogtwo from '../assets/images/blog 2.png';
import imageblogthree from '../assets/images/blog3.png';
import imageblogfour from '../assets/images/blog4.png';
import imageblogfive from '../assets/images/blog 6.png';
import imageblogsix from '../assets/images/blog5.png';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  content: string;
  author?: string;
  featured?: boolean;
}

export const useBlogPosts = () => {
  const { t } = useTranslation();

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      slug: "why-your-business-needs-virtual-receptionist",
      title: t('contentBlog.posts.post1.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post1.description'),
      image: imageblogone,
      author: "ASSIST-ME Team",
      featured: true,
      content: `
        <p>${t('contentBlog.posts.post1.content.introduction')}</p>
        
        <h2>${t('contentBlog.posts.post1.content.benefitsTitle')}</h2>
        
        <h3>1. ${t('contentBlog.posts.post1.content.benefit1.title')}</h3>
        <p>${t('contentBlog.posts.post1.content.benefit1.content')}</p>
        
        <h3>2. ${t('contentBlog.posts.post1.content.benefit2.title')}</h3>
        <p>${t('contentBlog.posts.post1.content.benefit2.content')}</p>
        
        <h3>3. ${t('contentBlog.posts.post1.content.benefit3.title')}</h3>
        <p>${t('contentBlog.posts.post1.content.benefit3.content')}</p>
        
        <h2>Conclusión</h2>
        <p>${t('contentBlog.posts.post1.content.conclusion')}</p>
      `
    },
    {
      id: "2",
      slug: "real-estate-agents-boost-business",
      title: t('contentBlog.posts.post2.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post2.description'),
      image: imageblogtwo,
      author: "ASSIST-ME Team",
      featured: true,
      content: `
        <p>${t('contentBlog.posts.post2.content.introduction')}</p>
        
        <h2>${t('contentBlog.posts.post2.content.benefitsTitle')}</h2>
        
        <h3>1. ${t('contentBlog.posts.post2.content.benefit1.title')}</h3>
        <p>${t('contentBlog.posts.post2.content.benefit1.content')}</p>
        
        <h3>2. ${t('contentBlog.posts.post2.content.benefit2.title')}</h3>
        <p>${t('contentBlog.posts.post2.content.benefit2.content')}</p>
        
        <h3>3. ${t('contentBlog.posts.post2.content.benefit3.title')}</h3>
        <p>${t('contentBlog.posts.post2.content.benefit3.content')}</p>
        
        <h2>Conclusión</h2>
        <p>${t('contentBlog.posts.post2.content.conclusion')}</p>
      `
    },
    {
      id: "3",
      slug: "accountant-virtual-assistant",
      title: t('contentBlog.posts.post3.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post3.description'),
      image: imageblogthree,
      author: "ASSIST-ME Team",
      content: `
        <p>${t('contentBlog.posts.post3.content.introduction')}</p>
        
        <h2>${t('contentBlog.posts.post3.content.benefitsTitle')}</h2>
        
        <h3>1. ${t('contentBlog.posts.post3.content.benefit1.title')}</h3>
        <p>${t('contentBlog.posts.post3.content.benefit1.content')}</p>
        
        <h3>2. ${t('contentBlog.posts.post3.content.benefit2.title')}</h3>
        <p>${t('contentBlog.posts.post3.content.benefit2.content')}</p>
        
        <h3>3. ${t('contentBlog.posts.post3.content.benefit3.title')}</h3>
        <p>${t('contentBlog.posts.post3.content.benefit3.content')}</p>
        
        <h2>Conclusión</h2>
        <p>${t('contentBlog.posts.post3.content.conclusion')}</p>
      `
    },
    {
      id: "4",
      slug: "hidden-costs-missing-calls",
      title: t('contentBlog.posts.post4.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post4.description'),
      image: imageblogfour,
      author: "ASSIST-ME Team",
      content: `
        <p>${t('contentBlog.posts.post4.content.introduction')}</p>
        
        <h2>${t('contentBlog.posts.post4.content.costsTitle')}</h2>
        
        <h3>1. ${t('contentBlog.posts.post4.content.cost1.title')}</h3>
        <p>${t('contentBlog.posts.post4.content.cost1.content')}</p>
        
        <h3>2. ${t('contentBlog.posts.post4.content.cost2.title')}</h3>
        <p>${t('contentBlog.posts.post4.content.cost2.content')}</p>
        
        <h3>3. ${t('contentBlog.posts.post4.content.cost3.title')}</h3>
        <p>${t('contentBlog.posts.post4.content.cost3.content')}</p>
        
        <h2>Conclusión</h2>
        <p>${t('contentBlog.posts.post4.content.conclusion')}</p>
      `
    },
    {
      id: "5",
      slug: "virtual-receptionist-comparison",
      title: t('contentBlog.posts.post1.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post1.description'),
      image: imageblogfive,
      author: "ASSIST-ME Team",
      content: `
        <p>${t('contentBlog.posts.post1.content.introduction')}</p>
        
        <h2>${t('contentBlog.posts.post1.content.benefitsTitle')}</h2>
        
        <h3>1. ${t('contentBlog.posts.post1.content.benefit1.title')}</h3>
        <p>${t('contentBlog.posts.post1.content.benefit1.content')}</p>
        
        <h3>2. ${t('contentBlog.posts.post1.content.benefit2.title')}</h3>
        <p>${t('contentBlog.posts.post1.content.benefit2.content')}</p>
        
        <h3>3. ${t('contentBlog.posts.post1.content.benefit3.title')}</h3>
        <p>${t('contentBlog.posts.post1.content.benefit3.content')}</p>
        
        <h2>Conclusión</h2>
        <p>${t('contentBlog.posts.post1.content.conclusion')}</p>
      `
    },
    {
      id: "6",
      slug: "real-estate-communication-strategies",
      title: t('contentBlog.posts.post2.title'),
      date: "08-11-2021",
      category: t('contentBlog.category'),
      description: t('contentBlog.posts.post2.description'),
      image: imageblogsix,
      author: "ASSIST-ME Team",
      content: `
        <p>${t('contentBlog.posts.post2.content.introduction')}</p>
        
        <h2>${t('contentBlog.posts.post2.content.benefitsTitle')}</h2>
        
        <h3>1. ${t('contentBlog.posts.post2.content.benefit1.title')}</h3>
        <p>${t('contentBlog.posts.post2.content.benefit1.content')}</p>
        
        <h3>2. ${t('contentBlog.posts.post2.content.benefit2.title')}</h3>
        <p>${t('contentBlog.posts.post2.content.benefit2.content')}</p>
        
        <h3>3. ${t('contentBlog.posts.post2.content.benefit3.title')}</h3>
        <p>${t('contentBlog.posts.post2.content.benefit3.content')}</p>
        
        <h2>Conclusión</h2>
        <p>${t('contentBlog.posts.post2.content.conclusion')}</p>
      `
    }
  ];

  return blogPosts;
};

// Helper function to get a post by slug
export const getPostBySlug = (slug: string): BlogPost | undefined => {
  const { t } = useTranslation();
  const blogPosts = useBlogPosts();
  return blogPosts.find(post => post.slug === slug);
};

// Helper function to get featured posts
export const getFeaturedPosts = (): BlogPost[] => {
  const blogPosts = useBlogPosts();
  return blogPosts.filter(post => post.featured);
};

// Helper function to get regular posts
export const getRegularPosts = (): BlogPost[] => {
  const blogPosts = useBlogPosts();
  return blogPosts.filter(post => !post.featured);
}; 