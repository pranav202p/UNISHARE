import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const AnalyticsDashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const userChartRef = useRef(null);
  const productChartRef = useRef(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/v1/auth/analytics/user');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user analytics data:', error);
      }
    };

    const fetchProductData = async () => {
      try {
        const response = await axios.get('/api/v1/auth/analytics/products');
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product analytics data:', error);
      }
    };

    fetchUserData();
    fetchProductData();

    return () => {
      // Cleanup chart instances
      if (userChartRef.current) {
        userChartRef.current.destroy();
      }
      if (productChartRef.current) {
        productChartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Update chart data when userData or productData changes
    if (userData && userChartRef.current) {
      userChartRef.current.data.datasets[0].data = [
        userData.totalUsers,
        userData.activeUsers,
        userData.newUsersToday,
      ];
      userChartRef.current.update();
    }

    if (productData && productChartRef.current) {
      productChartRef.current.data.datasets[0].data = [
        productData.totalCount,
      ];
      productChartRef.current.update();
    }
  }, [userData, productData]);
  
  const handleSignOut = () => {
    // Redirect to the home page ('/')
    navigate('/');
  };
  return (
    <>
      <div className="flex h-screen text-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 fixed top-0 bottom-0">
          <div className="p-5">
            <h1 className="text-lg font-bold">ADMIN</h1>
          </div>
          <nav className="mt-6">
            <Link to="/Dashboard" className="block py-2 px-4 text-2xl mt-4 font-semibold hover:bg-gray-700">
              Dashboard
            </Link>
            <Link to="/user" className="block py-2 px-4 text-2xl mt-24 font-semibold hover:bg-gray-700">
              Users
            </Link>
            <Link to="/resource" className="block py-2 px-4 text-2xl mt-24 font-semibold hover:bg-gray-700">
              Resources
            </Link>
            
            <Link to="/report" className="block py-2 px-4 text-2xl mt-24 font-semibold bg-gray-700">
              Reporting and Analytics
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <header className="bg-gray-200 border-b p-4 flex justify-between items-center">
            <h1 className="text-xl text-blue-800 font">Unishare</h1>
            <div>
              <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full mr-2 hover:bg-gray-300" onClick={handleSignOut}>
                Sign out
              </button>
             
            </div>
          </header>

          {/* Analytics Section */}
          <div className="p-6 mt-10 mx-64 space-y-6">
            <h2 className="text-2xl text-black text-center font-semibold mb-4">User Analytics</h2>
            {userData ? (
              <div className="bg-slate-200 rounded-lg shadow-xl p-6">
                <p className=" text-2xl text-gray-900">Total Users: {userData.totalUsers}</p>
                <p className="text-2xl text-gray-900">Active Users: {userData.activeUsers}</p>
                <p className="text-2xl text-gray-900">New Users (Today): {userData.newUsersToday}</p>
                {/* Display more user analytics data as needed */}
              </div>
            ) : (
              <p className="text-gray-700">Loading user analytics...</p>
            )}

            <h2 className="text-2xl  text-black text-center font-semibold mb-4">Product Analytics</h2>
            {productData ? (
              <div className="bg-slate-200 rounded-lg shadow-xl p-6">
                <p className="text-gray-900 text-2xl ">Total Products: {productData.totalCount}</p>
                {/* Display more product analytics data as needed */}
              </div>
            ) : (
              <p className="text-gray-700">Loading product analytics...</p>
            )}
            </div>
           {/* Analytics Section */}
           <div className="p-6 mt-10 mx-64 space-y-6">
            {/* User Analytics */}
            {userData ? (
              <div className="bg-slate-200 mx-auto rounded-lg shadow-xl p-6">
                <Bar
                  ref={userChartRef}
                  data={{
                    labels: ['Total Users', 'Active Users', 'New Users (Today)'],
                    datasets: [
                      {
                        label: 'User Analytics',
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 1,
                        data: [userData.totalUsers, userData.activeUsers, userData.newUsersToday],
                      },
                    ],
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-700">Loading user analytics...</p>
            )}
          <br>
          </br>
          <br>
          </br>
          <br>
          </br><br>
          </br>
          

          

            {/* Product Analytics */}
            {productData ? (
              <div className="bg-slate-200 rounded-lg h-1/2 w-1/2 mx-auto mt-94 shadow-xl p-6">
                <Pie
                  ref={productChartRef}
                  data={{
                    labels: ['Total Products'],
                    datasets: [
                      {
                        label: 'Product Analytics',
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        data: [productData.totalCount],
                      },
                    ],
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-700">Loading product analytics...</p>
            )}
          </div>
            
          
          </div>
        
      </div>
    </>
  );
}


export default AnalyticsDashboard;
