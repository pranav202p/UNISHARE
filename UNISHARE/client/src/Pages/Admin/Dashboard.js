import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const [userData, setUserData] = useState(null);
  const [productData, setProductData] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/v1/auth/analytics/user'); // Update API endpoint
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch product data
    const fetchProductData = async () => {
      try {
        const response = await axios.get('/api/v1/auth/analytics/products'); // Update API endpoint
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchUserData();
    fetchProductData();
    
  }, []);
  
  const handleSignOut = () => {
    // Redirect to the home page ('/')
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 fixed top-0 bottom-0">
          <div className="p-5">
         
            <h1 className="text-lg  text-white font-bold">ADMIN</h1>
          </div>
          <nav className="mt-6">
            <Link to="/Dashboard" className="block py-2 text-white px-4 text-2xl mt-4 font-semibold hover:bg-gray-700">
              Dashboard
            </Link>
            <Link to="/user" className="block py-2 px-4 text-white text-2xl mt-24 font-semibold hover:bg-gray-700">
              Users
            </Link>
            <Link to="/resource" className="block py-2  text-white  px-4 text-2xl mt-24 font-semibold hover:bg-gray-700">
              Resources
            </Link>
            
            <Link to="/report" className="block py-2 px-4  text-white text-2xl mt-24 font-semibold bg-gray-700">
              Reporting and Analytics
            </Link>
          </nav>
        </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-gray-200 border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-blue-800 font">Unishare</h1>
            <div>
              <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full mr-2 hover:bg-gray-300"  onClick={handleSignOut}>
                Sign out
              </button>
            
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-11 grid grid-cols-1 mx-64  md:grid-cols-2 lg:grid-cols-2 gap-20">
          {/* Total Users */}
          <div className="bg-gradient-to-br  from-red-500 to-orange-500 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">Total Users</h3>
            <p className="text-3xl font-bold text-white">{userData ? userData.totalUsers : 'Loading...'}</p>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">Active Users</h3>
            <p className="text-3xl font-bold text-white">{userData ? userData.activeUsers : 'Loading...'}</p>
          </div>

          {/* New Users */}
          <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">New Users</h3>
            <p className="text-3xl font-bold text-white">{userData ? userData.newUsers : 'Loading...'}</p>
          </div>

          {/* Total Products */}
          <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">Total Products</h3>
            <p className="text-3xl font-bold text-white">{productData ? productData.totalCount : 'Loading...'}</p>
          </div>
           {/* Contact Requests */}
           <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">Contact Requests</h3>
            <p className="text-3xl font-bold text-white">{ 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
