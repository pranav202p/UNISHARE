import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';
import Slider from 'react-slick';
import { toast } from 'react-toastify';


export default function Sell() {
  const [productData, setProductData] = useState({
    productId: '',
    productName: '',
    SellerName: '',
    SellerID: '',
    Selleremail:' ',
    
    productDescription: '',
    productImage: '',
    productPrice: '',
    productCategory: '',
    productCondition: ''
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleProductNameChange = async (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });

    try {
      const response = await axios.post('https://unishare.onrender.com/api/v1/auth/generate-product-id', {
        productName: value
      });

      setProductData((prevData) => ({
        ...prevData,
        productId: response.data.productId
      }));
    } catch (error) {
      console.error('Error generating productId:', error.message);
    }
  };

  const handleSellerNameChange = async (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });

    try {
      const response = await axios.post('https://unishare.onrender.com/api/v1/auth/generate-seller-id', {
        SellerName: value
      });

      setProductData((prevData) => ({
        ...prevData,
        SellerID: response.data.SellerID
      }));
    } catch (error) {
      console.error('Error generating SellerId:', error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('productImage', file);

    try {
      const response = await axios.post('https://unishare.onrender.com/api/v1/auth/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setProductData({
          ...productData,
          productImage: response.data.imageUrl
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@mca\.christuniversity\.in$/;
    if (!emailRegex.test(productData.Selleremail)) {
      toast.error('Please enter a valid email address in the format username@mca.christuniversity.in');
      return;
    }
  

      const response = await axios.post('https://unishare.onrender.com/api/v1/auth/sell', productData);
      

      if (response.status === 201) {
        setSubmitSuccess(true); // Set submit success state
        console.log('Product submitted successfully');
      } else {
        throw new Error('Failed to submit product data');
      }
    } catch (error) {
      console.error('Error submitting product:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const carouselImages = [
    'images/car2.png',
    'images/car3.png',
    'images/matt-ragland-02z1I7gv4ao-unsplash.jpg'
    
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 1900,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  useEffect(() => {
    // Cleanup function for any cleanup needed
    return () => {
      // Your cleanup code here (if any)
    };
  }, []);

  return (
    <Layout>
      <Slider {...settings} className='mt-8 max-w-screen-lg mx-auto'>
        {carouselImages.map((image, index) => (
          <div key={index} className='w-full'>
            <img src={image} alt={`Slide ${index}`} className="w-full mx-auto h-auto max-h-96 object-cover" />
          </div>
        ))}
      </Slider>
      <div className="min-h-screen flex mt-10 items-center mb-44 justify-center bg-gray-100">
        <div className="max-w-4xl w-full bg-gray-200 border-cyan-600 rounded-lg overflow-hidden shadow-xl p-8">
        <div className="flex items-center">
            <img src="/images/new.png" alt="Form Image" className="w-32 h-32 mr-4 object-cover" />
            <h2 className="text-3xl mx-24 font-bold">Sell or Rent a Product</h2>
          </div>
          <form onSubmit={handleSubmit}  img src="/images/new.png"alt="Form Image" className="space-y-4">
          
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1 mb-4">
                <label htmlFor="productName" className="block text-xl font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={productData.productName}
                  onChange={handleProductNameChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="flex-1 mb-4">
                <label htmlFor="productId" className="block text-xl font-medium text-gray-700 mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  id="productId"
                  name="productId"
                  value={productData.productId}
                  readOnly
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1 mb-4">
                <label htmlFor="SellerName" className="block text-xl font-medium text-gray-700 mb-2">
                  Seller Name
                </label>
                <input
                  type="text"
                  id="SellerName"
                  name="SellerName"
                  value={productData.SellerName}
                  onChange={handleSellerNameChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="flex-1 mb-4">
                <label htmlFor="SellerID" className="block text-xl font-medium text-gray-700 mb-2">
                  Seller ID
                </label>
                <input
                  type="text"
                  id="SellerID"
                  name="SellerID"
                  value={productData.SellerID}
                  readOnly
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                />
              </div>
              <div className="mb-4">
              <label htmlFor="Selleremail" className="block text-xl font-medium text-gray-700 mb-2">
                Seller Email
              </label>
              <input
                type="email"
                id="Selleremail"
                name="Selleremail"
                value={productData.Selleremail}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="productDescription" className="block text-xl font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={productData.productDescription}
                onChange={handleChange}
                rows="3"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="productImage" className="block text-xl font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <input
                type="file"
                id="productImage"
                name="productImage"
                onChange={handleImageUpload}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productPrice" className="block text-xl font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                id="productPrice"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productCategory" className="block text-xl font-medium text-gray-700 mb-2">
                Product Category
              </label>
              <select
                id="productCategory"
                name="productCategory"
                value={productData.productCategory}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2"
              >
                <option value="">Select a category</option>
                <option value="books">Books</option>
                <option value="electronics">Electronics</option>
                <option value="Stationery">Stationery</option>
                <option value="Study Guides">Study Guides</option>
                <option value="sports">Sports</option>
                <option value="Clothing">Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="productCondition" className="block text-xl font-medium text-gray-700 mb-2">
                Product Condition
              </label>
              <select
                id="productCondition"
                name="productCondition"
                value={productData.productCondition}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md px-4 py-2"
              >
                <option value="">Select the condition</option>
                <option value="new">New (For Sale)</option>
                <option value="used">Used (For Sale)</option>
                <option value="rent_monthly">Rent Monthly</option>
                <option value="rent_weekly">Rent Weekly</option>
              </select>
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 w-full"
              >
                Submit
              </button>
            </div>
          </form>
          {/* Notification for successful submission */}
          {submitSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> Product submitted successfully.</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg
                  className="fill-current h-6 w-6 text-green-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  onClick={() => setSubmitSuccess(false)}
                >
                  <title>Close</title>
                  <path
                    fillRule="evenodd"
                    d="M14.354 5.354a2 2 0 10-2.828-2.828L10 7.172 7.475 4.646a2 2 0 10-2.828 2.828L7.172 10l-2.526 2.525a2 2 0 102.828 2.828L10 12.828l2.525 2.526a2 2 0 102.828-2.828L12.828 10l2.526-2.525z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          )}
          </div>
      </div>
    </Layout>
  );
}
