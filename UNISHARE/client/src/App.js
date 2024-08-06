import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/useWishlist';

import Home from './Pages/Home';
import Aboutus from './Pages/Aboutus';
import Contactus from './Pages/Contactus';
import Buy from './Pages/Buy';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Sell from './Pages/Sell';
import ProductDetail from './Pages/ProductDetail';
import NotifySeller from './Pages/NotifySeller';
import UserProfile from './Components/UserProfile';
import UserAds from './Components/UserAds';
import UserWishlist from './Components/UserWishlist';
import UserOrders from './Components/UserOrders';
import Settings from './Pages/Settings';

import PageNotFound from './Pages/PageNotFound';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Dashboard from './Pages/Admin/Dashboard';
import UserManagement from './Pages/Admin/UserManagement';
import ResourceManagement from './Pages/Admin/ResourceManagement';
import AnalyticsDashboard from './Pages/Admin/AnalyticsDashboard';

function App() {
  return (
   
      <WishlistProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/contact" element={<Contactus />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/notify-seller" element={<NotifySeller />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/ads" element={<UserAds />} />
          <Route path="/wishlist" element={<UserWishlist />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/DashBoard" element={<Dashboard />} />
          <Route path="/user" element={<UserManagement />} />
         
          <Route path="/resource" element={<ResourceManagement />} />
          <Route path="/report" element={<AnalyticsDashboard />} />
         
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </WishlistProvider>

  );
}

export default App;
