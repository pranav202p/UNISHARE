import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';
import { motion } from 'framer-motion';
import { Link,  useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Buy() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevant'); 
  const [productsPerPage] = useState(9);
  const categories = ["Lecture Notes", "Study Guides", "electronics",  "books","stationery", "sports","Clothing", "other"];
  const navigate=useNavigate()
  // Fetch products from the backend API
  // Fetch products from the backend API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('/api/v1/auth/products');
        console.log('Response data:', response.data);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on search term, selected categories, and not sold
  useEffect(() => {
    if (!Array.isArray(products)) return; // Check if products is an array

    let filtered = products.filter(product => (
      product.isApproved && // Check if product is approved
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.productCategory))
    ));

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategories]);


  const isLoggedIn = () => {
    // Check if user is logged in
    const authToken = localStorage.getItem('auth');
    return authToken !== null && authToken !== undefined;
  };

  const handleSellnow = () => {
    if (isLoggedIn()) {
      // User is logged in, proceed with chat logic
      navigate('/sell');
    } else {
      // User is not logged in, redirect to login page
      navigate('/login');
    }
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts
    .slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleCategoryChange = (category) => {
    const index = selectedCategories.indexOf(category);
    if (index === -1) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      const updatedCategories = [...selectedCategories];
      updatedCategories.splice(index, 1);
      setSelectedCategories(updatedCategories);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
  };

  return (
    <Layout>
      <div className=" bg-gradient-to-l from-blue-800 to-pink-300  py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center text-center text-white">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl font-bold mb-4">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 2, y: 0 }}
                transition={{ duration: 2}}
                className="text-3xl font-bold text-black"
              >
                Discover Products    
              </motion.h1>
            </h1>
            <div className="prose lg:prose-lg">
              <p className="text-xl text-black">Discover and contribute to a wealth of shared knowledge and resources within our college community. From lecture notes to study guides and project materials, find what you need to succeed together. Start selling your products now.</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-4 " onClick={handleSellnow}>Sell Now</button>
          </div>
        </div>
      </div>
      <div className='bg-white min-h-[1800px] bg-opacity-99'style={{paddingTop:'25px'}}>
      <div className="flex justify-center items-center md:w-2/2">

          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-3/4 border bg-gray-200 text-black rounded-md focus:outline-none focus:border-blue-500"
            />
           
          </div>
        </div>
      
      <div className="container mx-1 md:flex ">
      <div className="md:w-2/6 mx-0 overflow-y-auto" style={{ maxHeight: 'calc(60vh - 200px)', paddingLeft: '30px',paddingRight:'1px' }}>
    <div className="bg-white bg-opacity-99 shadow-lg p-4">
      <h2 className="text-xl font-bold text-black mx-10 mb-6 ">Filters</h2>
      {categories.map(category => (
        <div key={category} className="flex items-center mb-8">
          <input 
            type="checkbox" 
            id={category} 
            name={category} 
            value={category} 
            checked={selectedCategories.includes(category)} 
            onChange={() => handleCategoryChange(category)}
            className="mr-2 mx-8"
          />
          <label htmlFor={category} className="text-xl text-black relative">{category}</label>
        </div>
      ))}
    </div>
  </div>

  <div className="md:w-2/2 mr-px my-12 flex justify-center items-center  bg-white bg-opacity-99" style={{ paddingLeft: '200px' }}>
  <div className="grid gap-5 md:grid-cols-2  md:gap-24 2xl:grid-cols-3">
    {currentProducts.map(product => (
      <motion.div
        key={product._id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-10 mb-12 relative" // Added relative positioning
        style={{ minHeight: '300px' }} // Set a minimum height for each card
      >
        <div className="w-full h-48 overflow-hidden object-cover  mb-4">
          <img
            src={product.productImage}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-black text-center">
          <h3 className="text-lg font-bold mb-2">{product.productName}</h3>
          <p className="text-gray-600">RS {product.productPrice}</p>
          <Link to={`/products/${product._id}`} className="text-black">View Details</Link>
        </div>
      </motion.div>
    ))}
  </div>
  </div>
</div>
  <div className="flex justify-center mt-8">
  <button onClick={handlePrevPage} className="mx-1 px-3 py-1 rounded bg-gray-300 text-black">
          <FaChevronLeft />
        </button>
  {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={handleNextPage} className="mx-1 px-3 py-1 rounded bg-gray-300 text-black">
          <FaChevronRight />
        </button>
  </div>

</div>

    </Layout>
  );
}
