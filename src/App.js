import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Navbar from './components/NavBar'
import Footer from './components/Footer'
import HeroSection from './components/Home/HeroSection'
import GalleryCarousel from './components/Home/GalleryCarousel'
import AboutUs from './components/Home/AboutUs'
import TransparencySection from './components/Home/TransparencySection'
import VolunteerSection from './components/Home/VolunteerSection'
import ContactSection from './components/Home/ContactSection'

import PrivacyPolicy from './components/PrivacyPolicy'
import TermsAndConditions from './components/TermsAndCondition'
import InternshiForm from './components/InternshiForm'

import AboutUsPage from './pages/public/AboutUsPage'
import PlantationDrives from './pages/public/PlantationDrives'
import GalleryPage from './pages/public/GalleryPage'
import ContactPage from './pages/public/ContactPage'
import TeamPage from './pages/public/TeamPage'
import DonatePage from './pages/public/DonatePage'
import DonateStatus from './pages/public/DonateStatus'
import CertificationPage from './pages/public/CertificationPage'
import CausesPage from './pages/public/CausesPage'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AdminLogin from './pages/auth/AdminLogin'

import DashboardLayout from './pages/dashboard/DashboardLayout'
import ProfileOverview from './pages/dashboard/ProfileOverview'
import DonationHistory from './pages/dashboard/DonationHistory'
import CertificateRequests from './pages/dashboard/CertificateRequests'

import AdminLayout from './pages/admin/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import AdminBanners from './pages/admin/AdminBanners'
import AdminGallery from './pages/admin/AdminGallery'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminTeam from './pages/admin/AdminTeam'
import AdminCertifications from './pages/admin/AdminCertifications'
import AdminUsers from './pages/admin/AdminUsers'
import AdminContactSettings from './pages/admin/AdminContactSettings'
import AdminCertificateRequests from './pages/admin/AdminCertificateRequests'
import AdminDonations from './pages/admin/AdminDonations'
import FixedRightCard from './components/FixedRightCard'
import ScrollToTop from './components/common/ScrollToTop'
import AdminCounters from './pages/admin/AdminCounters'
import AdminBannerCard from './pages/admin/AdminBannerCard'

const Home = () => (
  <div>
    <HeroSection />
    <GalleryCarousel />
    <AboutUs />
    <TransparencySection />
    <VolunteerSection />
    <ContactSection />
  </div>
)

const App = () => {
  return (
    <AuthProvider>
      <Router>
      <ScrollToTop />
        <Navbar />
        <FixedRightCard />
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/plantation-drives" element={<PlantationDrives />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/donate/thank-you" element={<DonateStatus />} />
          <Route path="/certifications" element={<CertificationPage />} />
          <Route path="/causes" element={<CausesPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/internship-form" element={<InternshiForm />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileOverview />} />
            <Route path="donations" element={<DonationHistory />} />
            <Route path="certificate-requests" element={<CertificateRequests />} />
          </Route>

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="certificate-requests" element={<AdminCertificateRequests />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="contact-settings" element={<AdminContactSettings />} />
            <Route path="counters" element={<AdminCounters />} />
            <Route path="banner-card" element={<AdminBannerCard />} />
     
     
          </Route>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
