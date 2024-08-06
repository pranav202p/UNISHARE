import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import ProductChat from '../Components/ProductChat';
import { useWishlist } from '../context/useWishlist';
import Modal from '../Components/Modal';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductDetail = ({ categoryName }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/products/${productId}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/products?category=${categoryName}`);
        const filteredRecommended = response.data.products.filter(
          (recommendedProduct) => recommendedProduct._id !== productId
        );
        setRecommendedProducts(filteredRecommended);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommended products:', error);
        setLoading(false);
      }
    };
  
    if (product) {
      fetchRecommendedProducts();
    }
  }, [categoryName, productId, product]);
  
  const isLoggedIn = () => {
    const authToken = localStorage.getItem('auth');
    return authToken !== null && authToken !== undefined;
  };

  const notifySeller = async () => {
    if (isLoggedIn()) {
      try {
        let userPhoneNumber;
        const phoneNumberRegex = /^\d{10}$/;
  
        // Prompt the user to enter their phone number until a valid number is provided
        do {
          userPhoneNumber = prompt('Please enter your phone number:');
          if (!userPhoneNumber) {
            return; // Exit function if user cancels or enters empty value
          }
  
          // Validate the phone number format using a regular expression
          const phoneNumberRegex = /^\d{10}$/; // Example: 10-digit phone number format
          if (!phoneNumberRegex.test(userPhoneNumber)) {
            alert('Please enter a valid 10-digit phone number.'); // Display error message
          }
        } while (!phoneNumberRegex.test(userPhoneNumber)); // Repeat until valid phone number is entered
  
        // If a valid phone number is entered, proceed to notify the seller
        await axios.post('/api/v1/auth/notify-seller', {
          productId: productId,
          message: `My contact number is ${userPhoneNumber}.`,
        });
  
        toast.success('Seller has been notified.');
      } catch (error) {
        console.error('Error notifying seller:', error);
      }
    } else {
      navigate('/login');
    }
  };
  
  const handleAddToWishlist = async () => {
    try {
      const authData = localStorage.getItem('auth');
      if (!authData) {
        navigate('/login');
        return;
      }

      const { token } = JSON.parse(authData);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        productId: productId,
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        SellerName: product.SellerName,
        productCondition: product.productCondition,
      };

      const response = await axios.post('/api/v1/auth/user/wishlist', payload, config);

      setAddedToWishlist(true);
      toast.success('Product added to wishlist!');
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      toast.error('Failed to add product to wishlist. Please try again.');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="bg-white">
        <div className="bg-white mt-40">
          <div className="container my-24 mt-0 mx-auto border-blue border-3 md:px-6 xl:px-32">
            {/* Product Details */}
            <div className="block rounded-lg  dark:bg-white border-blue-500 border-4">
              {/* Product Image */}
              <div className="flex flex-wrap border-blue-800 border-3 items-center">
                <div className="block w-full shrink-0 mt-0 grow-0 basis-auto lg:flex lg:w-6/12 xl:w-4/12">
                  <img src={product.productImage} alt={product.productName} className="w-full rounded-t-lg lg:rounded-tr-none  lg:rounded-bl-lg" />
                </div>
                {/* Product Details */}
                <div className="w-full shrink-0 grow-0  basis-auto lg:w-2/12 xl:w-8/12">
                  <div className="px-6 py-12 md:px-12">
                    <h2 className="mb-6 pb-2 text-4xl text-center bg-slate-200 w-1/2 font-bold">{product.productName}</h2>
                    <p className="mb-6 pb-2 text-neutral-500  text-xl  w-full dark:text-black">Description: {product.productDescription}</p>
                    <p className="mb-6 pb-2 text-neutral-500  text-xl bg-red-200 w-1/4 dark:text-black">Price: {product.productPrice}</p>
                    <p className="mb-6 pb-2 text-neutral-500  text-xl  w-1/4 dark:text-black">Seller Name: {product.SellerName}</p>
                    <p className="mb-6 pb-2 text-neutral-500  text-xl   w-1/2 dark:text-black">Product Condition: {product.productCondition}</p>
                    {/* Action Buttons */}
                    <div className="flex justify-between p-11 space-x-4">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full" onClick={notifySeller}>Notify Seller</button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full" onClick={handleAddToWishlist}>
                        {addedToWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                      </button>
                    </div>
                    {/* Chat Modal */}
                    <Modal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)}>
                      <ProductChat productId={productId} />
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
            {/* Recommended Products Section */}
            <section>
              <h2 className="text-2xl text-center p-16 font-bold mb-4">Recommended Products {categoryName}</h2>
              <div className="flex space-x-16 mb-11 h-auto overflow-x-auto">
                {recommendedProducts.slice(0, 4).map((recommendedProduct) => (
                  <div key={recommendedProduct.productId} className="flex-shrink-0 shadow-2xl border-spacing-9 w-64 border-blue-500 border-4">
                    <div className="bg-white mb-11 rounded-lg shadow-md p-4">
                      <img
                        src={recommendedProduct.productImage}
                        alt={recommendedProduct.productName}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium">{recommendedProduct.productName}</p>
                      <p className="text-sm text-gray-500 p-2">RS {recommendedProduct.productPrice}</p>
                      <Link to={`/products/${recommendedProduct.productId}`} className="text-black">View Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
