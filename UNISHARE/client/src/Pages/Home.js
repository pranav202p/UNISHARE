import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import '../App.css'; // Import the Slider.css file
import { Parallax } from 'react-parallax';
import  { useState, useEffect } from 'react';
import _debounce from 'lodash/debounce';

import axios from 'axios';

const Home = () => {
  const slides = ['slide1', 'slide2', 'slide3', 'slide4', 'slide5'];
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = _debounce(() => {
      setScrollY(window.scrollY);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/v1/auth/products');
        console.log(response)
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // const renderApprovedProducts = () => {
  //   return products.slice(0,6).map((product) => {
  //     if (product.isApproved) {
  //       return (
  //         <div key={product._id} className="bg-white shadow-2xl p-4 rounded-2xl">
  //           <img
  //             src={product.productImage}
  //             alt={product.productName}
  //             className="w-full h-32 object-cover mb-4 rounded-md"
  //           />
  //           <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
  //           <p className="text-sm text-gray-600 mb-2">{product.description}</p>
  //           <Link to={`/products/${product._id}`} className="text-black">View Details</Link>
  //         </div>
  //       );
  //     }
  //     return null; // Skip rendering if product is not approved
  //   });
  // };

  const isLoggedIn = () => {
    const authToken = localStorage.getItem('auth');
    return authToken !== null && authToken !== undefined;
  };

  return (
    <Layout>
       <Parallax bgImage='/images/shawn-henley-Gey6OS4ZZH8-unsplash.jpg ' bgImageAlt="background"       className="custom-parallax"
 strength={1000}>
        <section className="py-48 text-center " style={{ height: '700px',width:'100%' }}>
        <div className="bg-black bg-opacity-50 py-8">
            <h1 className="text-4xl font-bold text-white mb-4">Discover and Share College Resources</h1>
            <p className="text-xl text-white font-semibold mb-8">Find and share resources with the community</p>
            <Link to="/buy" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full font-semibold transition duration-300">
              Explore Resources
            </Link>
          </div>
        </section>
      </Parallax>
      {/* Featured Resources Section */}
      {/*<section className="py-12 p-11 bg-white">
        <div className="container mx-auto px-4 p-24">
          <h2 className="text-3xl font-bold text-center mb-6">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderApprovedProducts()}
          </div>
        </div>
      </section>

      {/* About Us Section with Background Image and Parallax Effect */}
      
        <Parallax
        className='rounded-2xl'
          bgImage='images/shawn-henley-Gey6OS4ZZH8-unsplash.jpg'
          bgImageAlt="the dog"
          strength={1000}
        >
          <section className="py-48 text-center" style={{ height: '700px',width:'100%' }}>
        <div className="bg-black bg-opacity-50 py-8">
            <h1 className="text-4xl font-bold text-white mb-4">About Our Community</h1>
            <p className="text-xl text-white font-semibold mb-8">We aim to facilitate knowledge sharing and collaboration among students through our platform.</p>
            <Link  to="/about" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full font-semibold transition duration-300">
            Learn More
            </Link>
          </div>
        </section>

          {/* Dark Overlay */}
         
        </Parallax>
     

      {/* Testimonials Section */}
      <section className="py-12">
        <div className="container mx-auto p-24 px-4">
          <h2 className="text-3xl font-bold text-center mb-6">What Our Users Say</h2>
          {/* Placeholder for testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sample testimonial cards (replace with actual data) */}
                     <div className="bg-white    p-4 rounded-md  border-blue-500 border-4">
              <p className="text-lg font-semibold mb-2">Kiran</p>
              <p className="text-sm text-gray-600 mb-4">"I discovered so many helpful resources on this platform! It's a game-changer for students looking to share and access valuable information."</p>

              <p className="text-xs text-gray-500">May 10, 2024</p>
            </div>
                     <div className="bg-white    p-4 rounded-md  border-blue-500 border-4">
              <p className="text-lg font-semibold mb-2">Virat</p>
              <p className="text-sm text-gray-600 mb-4">"This platform helped me connect with like-minded students and expand my knowledge horizon. It's an invaluable resource for academic growth!"</p>

              <p className="text-xs text-gray-500">June 5, 2024</p>
            </div>
            <div className="bg-white    p-4 rounded-md  border-blue-500 border-4">
              <p className="text-lg font-semibold mb-2">Smith</p>
              <p className="text-sm text-gray-600 mb-4">"Using this platform has been a rewarding experience. I've found great study materials and made meaningful connections with fellow students."</p>

              <p className="text-xs text-gray-500">June 5, 2024</p>
            </div>
            <div className="bg-white    p-4 rounded-md  border-blue-500 border-4">
              <p className="text-lg font-semibold mb-2">Jane</p>
              <p className="text-sm text-gray-600 mb-4">"I love how easy it is to discover new resources here. It's become my go-to place for sharing and finding study materials."</p>

              <p className="text-xs text-gray-500">June 5, 2024</p>
            </div>
          </div>
        </div>
      </section>
     

      
      
    </Layout>
  );
};

export default Home
