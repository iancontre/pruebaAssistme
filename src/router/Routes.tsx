import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Blog from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import FaqsPage from '../pages/FaqsPage';
import LoginPage from '../pages/LoginPage';
import CompraPage from '../pages/CompraPage';
import CustomerService from '../pages/CustomerService';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/:slug" element={<BlogPostPage/>} />
        <Route path="/faqs" element={<FaqsPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/compra" element={<CompraPage />} />
        <Route path="/customerService" element={<CustomerService />} />
        {/* Aquí puedes agregar más rutas según necesites */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 