import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import axios from 'axios';

const UserAds = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    console.log(config)
      const fetchUserProducts = async () => {
        try {
          const response = await axios.get('/api/v1/auth/user-products', config);
          console.log("products",response.data)
          setUserProducts(response.data.products);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching user products:', error);
          setIsLoading(false);
        }
      };

      fetchUserProducts();
    }
  }, []);

  const handleMarkAsSold = async (productId) => {
    try {
      const response = await axios.put(`/api/v1/auth/mark-as-sold/${productId}`);

      // Update the userProducts state to reflect the change
      setUserProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId ? { ...product, isSold: true } : product
        )
      );
    } catch (error) {
      console.error('Error marking product as sold:', error);
    }
  };

  return (
    <Layout>
      <div className="flex p-11">
        <div className="bg-white text-black ml-80 mt-11 w-full  md:w-64 flex-shrink-0">
          <div className="p-4 fixed ">
            <h1 className="text-2xl font-bold">Settings</h1>
            <ul className="mt-4">
              <li className="py-2 border-b border-gray-700"><Link to="/profile" className="block hover:bg-gray-200 px-4">Public Profile</Link></li>
              <li className="py-2 border-b border-gray-700"><Link to="/ads" className="block hover:bg-gray-200 px-4">Your Ads</Link></li>
              <li className="py-2 border-b border-gray-700"><Link to="/wishlist" className="block hover:bg-gray-200 px-4">Your Wishlist</Link></li>
            
            </ul>
          </div>
        </div>

        {/* User Ads Section */}
        <div className="max-w-4xl mx-auto mt-11">
          <h2 className="text-3xl font-bold text-center mb-8">Your Ads</h2>
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : userProducts.length === 0 ? (
            <p className="text-center text-2xl mb-24">No ads posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {userProducts.map((product, index) => (
                <div key={index} className="bg-slate-200 rounded-lg shadow-md p-6">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="h-48 w-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
                  <p className="text-gray-600 mb-2">${product.productPrice}</p>
                  {product.isSold ? (
                    <p className="text-green-600 font-semibold mb-2">Sold</p>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleMarkAsSold(product.productId)}
                    >
                      Mark as Sold
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserAds;
