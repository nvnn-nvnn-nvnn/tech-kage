import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PCBuilder from "./components/PCBuildMain";
import Footer from "./components/Footer";
import Header from "./components/Header";
import BlogShowCase from "./components/BlogShowCase";
import AIPCBuilder from "./builds/PCbuilder";
import PrebuiltPCDetail from "./products/PrebuiltPCDetail";
import PrebuiltPCs from "./products/PrebuiltPCs";
import DesktopAccessories from "./products/DesktopAccessories";
import RubberDucky from "./products/RubberDucky";
import Blog from "./pages/Blog";
import RaspberryPI from "./pages/RaspberryPI";
import Drones from "./pages/Drones";
import ProductsRoot from "./pages/ProductsRoot";
import ThreeDPrinting from "./pages/ThreeDPrinting";
import Contact from "./pages/Contact";
import Profile from "./profile/[id]"
import Cart from "./components/Cart";
import Success from "./pages/Success";
import Changelog from "./pages/Changelog";
import About from "./pages/About";
import Docs from "./pages/Docs";
import Community from "./pages/Community";
import Gallery from "./pages/Gallery";
import AffiliateNotice from "./pages/AffiliateNotice";
import BlogDetail from "./pages/BlogDetail";
import Placeholder from "./components/Placeholder";
import ManualPartPicker from "./pages/ManualPartPicker";
import PartsPage from "./components/parts-components/PartsPage";
import PartDetail from "./pages/PartDetail";
import Careers from "./pages/Careers";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminOrders from "./AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import DevelopmentBanner from "./components/DevelopmentBanner";
import Forums from "./pages/Forums";

function App() {
  const { user } = useAuth();
  return (
    <>
      <Header />
      <DevelopmentBanner />

      <Routes>
        {/* Landing page: hero + blogs */}
        <Route
          path="/"
          element={
            <>
              <PCBuilder />
              <Blog />
            </>
          }
        />

        {/* Builder page */}
        <Route path="/builder" element={<AIPCBuilder />} />

        {/* Manual Part Picker */}
        <Route path="/manual" element={<ManualPartPicker />} />

        {/* Part Detail Page (must come before /parts/:category) */}
        <Route path="/parts/:category/:id" element={<PartDetail />} />

        {/* Parts Pages by Category */}
        <Route path="/parts/:category" element={<PartsPage />} />

        {/* High-level nav pages (100vh placeholders) */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/raspberry" element={<RaspberryPI />} />
        <Route path="/drones" element={<Drones />} />
        <Route path="/ThreeDPrinting" element={<ThreeDPrinting />} />
        <Route path="/products" element={<ProductsRoot />} />
        <Route path="/forums" element={<Forums />} />

        {/* Product detail pages */}
        <Route path="/products/prebuilt" element={<PrebuiltPCs />} />
        <Route path="/products/prebuilt/:id" element={<PrebuiltPCDetail />} />
        <Route path="/products/accessories" element={<DesktopAccessories />} />
        <Route path="/products/rubberducky" element={<RubberDucky />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<Success />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/community" element={<Community />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/affiliate-notice" element={<AffiliateNotice />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          user?.email === 'devanlee2nd@gmail.com' ? <AdminDashboard /> : <Navigate to="/admin/login" />
        } />
        <Route path="/admin/orders" element={
          user?.email === 'devanlee2nd@gmail.com' ? <AdminOrders /> : <Navigate to="/admin/login" />
        } />

        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;