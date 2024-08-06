import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const navigate = useNavigate();
  const { productId } = useParams();


  const notifySeller = async () => {
    if (isLoggedIn()) {
      try {
        // Prompt the user to enter their phone number
        const userPhoneNumber = prompt('Please enter your phone number:');
        if (!userPhoneNumber) {
          return; // If user cancels or enters empty phone number, do nothing
        }

        // Send notification to seller including user's phone number
        await axios.post('/api/v1/auth/notify-seller', {
          productId: productId,
          message: `My contact number is ${userPhoneNumber}.`, // Include user's phone number in the message
        });

        toast.success('Seller has been notified.');
       
      } catch (error) {
        console.error('Error notifying seller:', error);
      }
    } else {
      navigate('/login');
    }
  };
  const isLoggedIn = () => {
    const authToken = localStorage.getItem('auth');
    return authToken !== null && authToken !== undefined;
  };
  // Define the fetchWishlist function within the component
  const fetchWishlist = async () => {
    try {
      const authData = localStorage.getItem('auth');
      if (!authData) {
        navigate('/login');
        return;
      }

      const { token } = JSON.parse(authData);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get('/api/v1/auth/wishlist', config);
      setWishlist(response.data); // Assuming the API response contains wishlist data
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    // Call fetchWishlist when the component mounts
    fetchWishlist();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const authData = localStorage.getItem('auth');
      if (!authData) {
        navigate('/login');
        return;
      }

      const { token } = JSON.parse(authData);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Send a request to remove the product from the wishlist
      await axios.delete(`/api/v1/auth/wishlist/${productId}`, config);

      // After successful removal, fetch updated wishlist
      fetchWishlist();
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };


  return (
    <Layout>
      <div className="flex p-11">
        <div className="bg-white text-black ml-80 mt-11 w-full md:w-64 flex-shrink-0">
          <div className="p-4 fixed">
            <h1 className="text-2xl font-bold">Settings</h1>
            <ul className="mt-4">
              <li className="py-2 border-b border-gray-700"><Link to="/profile" className="block hover:bg-gray-200 px-4">Public Profile</Link></li>
              <li className="py-2 border-b border-gray-700"><Link to="/ads" className="block hover:bg-gray-200 px-4">Your Ads</Link></li>
              <li className="py-2 border-b border-gray-700"><Link to="/wishlist" className="block hover:bg-gray-200 px-4">Your Wishlist</Link></li>
            </ul>
          </div>
        </div>
        <div className="w-full mx-auto">
          <h1 className="text-2xl text-center p-5 font-bold mb-5">Your Wishlist</h1>
          {wishlist && wishlist.products && wishlist.products.length > 0 ? (
            <div className="container my-24 mt-0 mx-auto border-blue border-3 md:px-6 xl:px-32">
              {wishlist.products.map((product) => (
                <div key={product.productId} className="block rounded-lg dark:bg-white border-blue-500 border-4">
                  {/* Product Image */}
                  <div className="flex flex-wrap border-blue-800 border-3 items-center">
                    <div className="block w-full shrink-0 mt-0 grow-0 basis-auto lg:flex lg:w-6/12 xl:w-4/12">
                      <img src={product.productImage} alt={product.productName} className="w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg" />
                    </div>
                    {/* Product Details */}
                    <div className="w-full shrink-0 grow-0 basis-auto lg:w-2/12 xl:w-8/12">
                      <div className="px-6 py-12 md:px-12">
                        <h2 className="mb-6 pb-2 text-4xl text-center bg-slate-200 w-1/2 font-bold">{product.productName}</h2>
                        <p className="mb-6 pb-2 text-neutral-500 text-xl  dark:text-black">Description: {product.productDescription}</p>
                        <p className="mb-6 pb-2 text-neutral-500 text-xl bg-red-200 w-1/4 dark:text-black">Price: {product.productPrice}</p>
                        <p className="mb-6 pb-2 text-neutral-500 text-xl w-1/4 dark:text-black">Seller Name: {product.SellerName}</p>
                        <p className="mb-6 pb-2 text-neutral-500 text-xl w-1/2 dark:text-black">Product Condition: {product.productCondition}</p>
                        {/* Remove from Wishlist Button */}
                        <div className="flex justify-between p-11 space-x-4">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold mt-4 px-4 " onClick={notifySeller}>Notify Seller</button>
                        <button
                          onClick={() => handleRemoveFromWishlist(product.productId)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
                        >
                          Remove from Wishlist
                        </button>  </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl text-gray-700">No products in your wishlist</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserWishlist;
