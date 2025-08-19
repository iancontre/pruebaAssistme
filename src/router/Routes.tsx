import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Blog from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import FaqsPage from '../pages/FaqsPage';
import LoginPage from '../pages/LoginPage';
import CompraPage from '../pages/CompraPage';
import CustomerService from '../pages/CustomerService';
import DashboardPage from '../pages/DashboardPage';
import ReporteLlamadasPage from '../pages/ReporteLlamadasPage';


const AppRoutes = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/:slug" element={<BlogPostPage/>} />
        <Route path="/faqs" element={<FaqsPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reporte-llamadas" element={<ReporteLlamadasPage />} />
        <Route path="/compra" element={<CompraPage />} />
        <Route path="/customerService" element={<CustomerService />} />

        {/* Aquí puedes agregar más rutas según necesites */}
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes; 